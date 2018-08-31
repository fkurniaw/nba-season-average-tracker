const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const app = express();
const port = 8080;
// const nba = require('nba.js');

const offlineServer = require('./offlineServer.js');
// const cumulativeFiltering = require(path.join(__dirname, '/gameLogFiltering', '/cumulativeSeasonAverageFiltering.js'));

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.listen(process.env.PORT || port, () => {
  console.info('Node.js server running at localhost:%s', port);
});

// log requests to console
app.use(logger('dev'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/allPlayers', (req, res) => {
  try {
    // NOTE: user-agent must be changed to Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36
    // const Season = `${req.query.year}-${Math.abs(parseInt(req.query.year) - 1999)}`;
    // nba.stats.allPlayers({ Season, IsOnlyCurrentSeason: '0', LeagueId: '00' }).then(nbaRes => {
    //   res.send(nbaRes.CommonAllPlayers.map(player => {
    //     return { id: player.person_id, firstLast: player.display_first_last, lastFirst: player.display_last_comma_first };
    //   }));
    // }).catch(err => {
    //   console.info(err);
    //   res.sendFile(path.join(__dirname, '/players.json'));
    // });
    res.sendFile(path.join(__dirname, '/players.json'));
  } catch (e) {
    console.info(e);
    res.sendFile(path.join(__dirname, '/players.json'));
  }
});

app.get('/playerStats', (req, res) => {
  try {
    const PlayerID = req.query.playerId;
    // nba.stats.playerProfile({ PlayerID, PerMode: 'PerGame', LeagueID: '00' }).then(nbaRes => {
    //   let results = {
    //     careerTotalsPost: nbaRes.CareerTotalsPostSeason,
    //     careerTotalsRegular: nbaRes.CareerTotalsRegularSeason,
    //     postSeasonAvg: nbaRes.SeasonTotalsPostSeason,
    //     regularSeasonAvg: nbaRes.SeasonTotalsRegularSeason
    //   };
    //   return res.send(results);
    // });
    return offlineServer.playerStats(PlayerID, res);
  } catch (e) {
    console.info(e);
    return res.send({});
  }
});

app.get('/getPlayerBio', (req, res) => {
  try {
    const PlayerID = req.query.playerId;
    // nba.stats.playerInfo({ PlayerID, LeagueID: '00' }).then(nbaRes => {
    //   nbaRes.CommonPlayerInfo[0].birthdate = nbaRes.CommonPlayerInfo[0].birthdate.slice(0, 10);
    //   let draftRound = nbaRes.CommonPlayerInfo[0].draft_round;
    //   let draftOvr = nbaRes.CommonPlayerInfo[0].draft_number;
    //   const addSuperscript = draftAttr => {
    //     switch (draftAttr) {
    //       case '1' || '21': draftAttr += 'st'; break;
    //       case '2' || '22': draftAttr += 'nd'; break;
    //       case '3' || '23': draftAttr += 'rd'; break;
    //       case null: break;
    //       default: draftAttr += 'th'; break;
    //     }
    //     return draftAttr;
    //   };
    //   draftRound = draftRound !== 'Undrafted' ? addSuperscript(draftRound) : draftRound;
    //   draftOvr = draftOvr !== 'Undrafted' ? addSuperscript(draftOvr) : draftOvr;
    //   nbaRes.CommonPlayerInfo[0].birthdate = nbaRes.CommonPlayerInfo[0].birthdate.slice(0, 10);
    //   nbaRes.CommonPlayerInfo[0].draft = nbaRes.CommonPlayerInfo[0].draft_year;
    //   nbaRes.CommonPlayerInfo[0].draft += draftRound !== null && draftOvr !== null &&
    //     draftRound !== 'Undrafted' && draftOvr !== 'Undrafted' ? ` (${draftRound} round, ${draftOvr} overall)` : '';
    //   return res.send(nbaRes);
    // });
    return offlineServer.getPlayerBio(PlayerID, res);
  } catch (e) {
    return res.send({});
  }
});

app.get('/getPlayerGameLog', (req, res) => {
  try {
    const Season = req.query.season;
    const PlayerID = req.query.playerId;
    // nba.stats.playerGamelog({ Season, PlayerID, LeagueID: '00', SeasonType: 'Regular Season' }).then(nbaRes => {
    //   nbaRes.PlayerGameLog.reverse();
    //   const { averages, totals } = cumulativeFiltering(nbaRes.PlayerGameLog);
    //   nbaRes.CumulativeAverageGameLog = averages;
    //   nbaRes.CumulativeTotalGameLog = totals;
    //   return res.send(nbaRes);
    // });
    return offlineServer.getPlayerGameLog(PlayerID, Season, res);
  } catch (e) {
    console.info(e);
    res.sendFile(path.join(__dirname, '/sampleData/gameLog', `Kobe2012-13Game.json`));
  }
});
