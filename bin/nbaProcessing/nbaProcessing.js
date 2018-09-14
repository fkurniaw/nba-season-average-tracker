const nba = require('../nba.js/lib/index.js');
const path = require('path');
const cumulativeFiltering = require('../gameLogFiltering/cumulativeSeasonAverageFiltering');

const allPlayers = (Season, res) => {
  // NOTE: user-agent must be changed to Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36
  nba.stats.allPlayers({ Season, IsOnlyCurrentSeason: '0', LeagueId: '00' }).then(nbaRes => {
    res.send(nbaRes.CommonAllPlayers.map(player => {
      return { id: player.person_id, firstLast: player.display_first_last, lastFirst: player.display_last_comma_first };
    }));
  }).catch(err => {
    console.info(err);
    res.sendFile(path.join(__dirname, '../players.json'));
  });
};

const getPlayerStats = (PlayerID, res) => {
  console.info('Getting Bio');
  nba.stats.playerProfile({ PlayerID, PerMode: 'PerGame', LeagueID: '00' }).then(nbaRes => {
    let results = {
      careerTotalsPost: nbaRes.CareerTotalsPostSeason,
      careerTotalsRegular: nbaRes.CareerTotalsRegularSeason,
      postSeasonAvg: nbaRes.SeasonTotalsPostSeason,
      regularSeasonAvg: nbaRes.SeasonTotalsRegularSeason
    };
    if (nbaRes.SeasonTotalsRegularSeason.length === 0) return res.send({ error: 'Error while fetching player stats. Player may not have been found.' });
    return res.send(results);
  }).catch(e => {
    console.info(e);
    return res.send({ error: 'Error while fetching player stats. Player may not have been found.' });
  });
};

const getPlayerBio = (PlayerID, res) => {
  nba.stats.playerInfo({ PlayerID, LeagueID: '00' }).then(nbaRes => {
    nbaRes.CommonPlayerInfo[0].birthdate = nbaRes.CommonPlayerInfo[0].birthdate.slice(0, 10);
    let draftRound = nbaRes.CommonPlayerInfo[0].draft_round;
    let draftOvr = nbaRes.CommonPlayerInfo[0].draft_number;
    const addSuperscript = draftAttr => {
      switch (draftAttr) {
        case '1' || '21': draftAttr += 'st'; break;
        case '2' || '22': draftAttr += 'nd'; break;
        case '3' || '23': draftAttr += 'rd'; break;
        case null: break;
        default: draftAttr += 'th'; break;
      }
      return draftAttr;
    };
    draftRound = draftRound !== 'Undrafted' ? addSuperscript(draftRound) : draftRound;
    draftOvr = draftOvr !== 'Undrafted' ? addSuperscript(draftOvr) : draftOvr;
    nbaRes.CommonPlayerInfo[0].birthdate = nbaRes.CommonPlayerInfo[0].birthdate.slice(0, 10);
    nbaRes.CommonPlayerInfo[0].draft = nbaRes.CommonPlayerInfo[0].draft_year;
    nbaRes.CommonPlayerInfo[0].draft += draftRound !== null && draftOvr !== null &&
      draftRound !== 'Undrafted' && draftOvr !== 'Undrafted' ? ` (${draftRound} round, ${draftOvr} overall)` : '';
    nbaRes.CommonPlayerInfo[0].current_team = `${nbaRes.CommonPlayerInfo[0].team_city} ${nbaRes.CommonPlayerInfo[0].team_name}`;
    nbaRes.CommonPlayerInfo[0].years_active = `${nbaRes.CommonPlayerInfo[0].from_year} - ${nbaRes.CommonPlayerInfo[0].to_year + 1}`;
    return res.send(nbaRes);
  }).catch(e => {
    console.info(e);
    return res.send({ error: 'Error while fetching player bio. Player may not have been found.' });
  });
};

const getPlayerGameLog = (PlayerID, Season, res, SeasonType) => {
  nba.stats.playerGamelog({ Season, PlayerID, LeagueID: '00', SeasonType }).then(nbaRes => {
    nbaRes.PlayerGameLog.reverse();
    nbaRes.PlayerGameLog.forEach((game, i) => {
      game.game_num = i + 1; // for tracking original order of games
    });
    const { averages, totals, missingFields } = cumulativeFiltering(nbaRes.PlayerGameLog);
    nbaRes.CumulativeAverageGameLog = averages;
    nbaRes.CumulativeTotalGameLog = totals;
    nbaRes.missingFields = missingFields;
    return res.send(nbaRes);
  });
};

module.exports = {
  allPlayers,
  getPlayerBio,
  getPlayerGameLog,
  getPlayerStats
};
