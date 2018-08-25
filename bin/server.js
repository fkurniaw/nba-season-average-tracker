const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const app = express();
const port = 8080;
const nba = require('nba.js');
// const statsNBA = 'http://stats.nba.com/stats';

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
    // NOTE: user-agent must be changed to Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36
    const Season = `${req.query.year}-${Math.abs(parseInt(req.query.year) - 1999)}`;
    nba.stats.allPlayers({ Season, IsOnlyCurrentSeason: '0', LeagueId: '00' }).then(nbaRes => {
      res.send(nbaRes.CommonAllPlayers);
    }).catch(err => {
      console.info(err);
      res.send([]);
    });
  } catch (e) {
    console.info(e);
    return res.send([]);
  }
});
