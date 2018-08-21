const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const nba = require('nba.js');
const path = require('path');
const app = express();
const port = 8080;
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

app.get('/ping', (req, res) => {
  console.info('pinged');
  return res.send('pong');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/allPlayers', (req, res) => {
  try {
    nba.data.players({ year: req.query.year }).then(nbaRes => {
      let playerList = [];
      for (var player in nbaRes.league.standard) {
        playerList.push(nbaRes.league.standard[player]);
      }
      return res.send(playerList);
    });
  } catch (e) {
    console.info(e);
    return res.send([]);
  }
});

app.get('/allPlayersStats', (req, res) => {
  try {
    nba.stats.allPlayers((err, nbaRes) => {
      if (err) {
        console.error(err);
      }
      res.send(nbaRes);
    });
  } catch (e) {
    console.info(e);
    res.send({});
  }
});
