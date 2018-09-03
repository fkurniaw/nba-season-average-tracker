const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const app = express();
const port = 8080;

const nbaProcessing = require('./nbaProcessing/nbaProcessing.js');
// const offlineServer = require('./offlineServer.js');

app.use(express.static(path.join(__dirname, '../public')));
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
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/allPlayers', (req, res) => {
  try {
    // NOTE: user-agent must be changed to Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36
    // const Season = `${req.query.year}-${Math.abs(parseInt(req.query.year) - 1999)}`;
    // return nbaProcessing.allPlayers(Season, res);
    return res.sendFile(path.join(__dirname, '/players.json')); // offline
  } catch (e) {
    console.info(e);
    res.sendFile(path.join(__dirname, '/players.json'));
  }
});

app.get('/playerStats', (req, res) => {
  try {
    const PlayerID = req.query.playerId;
    return nbaProcessing.playerStats(PlayerID, res);
    // return offlineServer.playerStats(PlayerID, res);
  } catch (e) {
    console.info(e);
    return res.send({});
  }
});

app.get('/getPlayerBio', (req, res) => {
  try {
    const PlayerID = req.query.playerId;
    return nbaProcessing.getPlayerBio(PlayerID, res);
    // return offlineServer.getPlayerBio(PlayerID, res);
  } catch (e) {
    return res.send({});
  }
});

app.get('/getPlayerGameLog', (req, res) => {
  try {
    const Season = req.query.season;
    const PlayerID = req.query.playerId;
    return nbaProcessing.getPlayerGameLog(PlayerID, Season, res);
    // return offlineServer.getPlayerGameLog(PlayerID, Season, res);
  } catch (e) {
    console.info(e);
    res.sendFile(path.join(__dirname, '/sampleData/gameLog', `Kobe2012-13Game.json`));
  }
});
