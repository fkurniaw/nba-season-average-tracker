const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 8080;
const nba = require('nba.js');

const cumulativeFiltering = require(path.join(__dirname, '/gameLogFiltering', '/cumulativeSeasonAverageFiltering.js'));

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
    switch (PlayerID) { // offline testing
      case '977':
        res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsKobe.json'));
        break;
      case '76003':
        res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsKareem.json'));
        break;
      case '893': // Jordan
        res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStats.json'));
        break;
      case '2544':
        res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsLeBron.json'));
        break;
      case '76375':
        res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsWilt.json'));
        break;
      default:
        res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsLeBron.json'));
        break;
    }
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
    //   return res.send(nbaRes);
    // });
    fs.readFile(path.join(__dirname, 'sampleData', 'playerBio', `${PlayerID === '893' ? 'Michael' : 'Kobe'}Bio.json`), (err, data) => {
      if (err && err.code === 'ENOENT') console.error('Invalid filename provided');
      try {
        var playerBio = JSON.parse(data);
        playerBio.CommonPlayerInfo[0].birthdate = playerBio.CommonPlayerInfo[0].birthdate.slice(0, 10);
        return res.send(playerBio);
      } catch (err) { console.info(err); }
    });
    // res.sendFile(path.join(__dirname, 'sampleData', 'playerBio', 'KobeBio.json')); // offline testing
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
    const playerIdMap = { '977': 'Kobe', '76375': 'Wilt', '893': 'Michael' }; // for offline testing
    let gameLogDir = path.join(__dirname, '/sampleData/gameLog', `${playerIdMap[PlayerID]}${Season}Game.json`);
    fs.readFile(gameLogDir, 'utf8', (err, data) => {
      if (err && err.code === 'ENOENT') console.error('Invalid filename provided');
      try {
        var gameLog = JSON.parse(data);
        gameLog.PlayerGameLog.reverse();
        const { averages, totals } = cumulativeFiltering(gameLog.PlayerGameLog);
        gameLog.CumulativeAverageGameLog = averages;
        gameLog.CumulativeTotalGameLog = totals;
        return res.send(gameLog);
      } catch (err) {}
    });
  } catch (e) {
    console.info(e);
    res.sendFile(path.join(__dirname, '/sampleData/gameLog', `Kobe2012-13Game.json`));
  }
});
