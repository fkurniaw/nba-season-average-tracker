const fs = require('fs');
const path = require('path');
const cumulativeFiltering = require(path.join(__dirname, '/gameLogFiltering', '/cumulativeSeasonAverageFiltering.js'));

const playerStats = (playerID, res) => {
  switch (playerID) {
    case '977':
      return res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsKobe.json'));
    case '893':
      return res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsJordan.json'));
    case '2544':
      return res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsLeBron.json'));
    case '76375':
      return res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsWilt.json'));
    case '76003':
      return res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsKareem.json'));
    default:
      return res.sendFile(path.join(__dirname, 'sampleData/playerStatsCareer', 'playerStatsLeBron.json'));
  }
};

const getPlayerBio = (playerID, res) => {
  fs.readFile(path.join(__dirname, 'sampleData', 'playerBio', `${playerID === '893' ? 'Michael' : 'Kobe'}Bio.json`), (err, data) => {
    if (err && err.code === 'ENOENT') console.error('Invalid filename provided');
    try {
      var playerBio = JSON.parse(data);
      let draftRound = playerBio.CommonPlayerInfo[0].draft_round;
      let draftOvr = playerBio.CommonPlayerInfo[0].draft_number;
      const addSuperscript = draftAttr => {
        switch (draftAttr) {
          case '1' || '21': draftAttr += 'st'; break;
          case '2' || '22': draftAttr += 'nd'; break;
          case '3' || '23': draftAttr += 'rd'; break;
          default: draftAttr += 'th'; break;
        }
        return draftAttr;
      };
      draftRound = addSuperscript(draftRound);
      draftOvr = addSuperscript(draftOvr);
      playerBio.CommonPlayerInfo[0].birthdate = playerBio.CommonPlayerInfo[0].birthdate.slice(0, 10);
      playerBio.CommonPlayerInfo[0].draft = `${playerBio.CommonPlayerInfo[0].draft_year}
        (${draftRound} round, ${draftOvr} overall)`;
      return res.send(playerBio);
    } catch (err) { console.info(err); }
  });
};

const getPlayerGameLog = (playerID, season, res) => {
  const playerIdMap = { '977': 'Kobe', '76375': 'Wilt', '893': 'Michael' }; // for offline testing
  let gameLogDir = path.join(__dirname, '/sampleData/gameLog', `${playerIdMap[playerID]}${season}Game.json`);
  fs.readFile(gameLogDir, 'utf8', (err, data) => {
    if (err && err.code === 'ENOENT') console.error('Invalid filename provided');
    try {
      var gameLog = JSON.parse(data);
      gameLog.PlayerGameLog.reverse();
      const { averages, totals } = cumulativeFiltering(gameLog.PlayerGameLog);
      gameLog.CumulativeAverageGameLog = averages;
      gameLog.CumulativeTotalGameLog = totals;
      return res.send(gameLog);
    } catch (err) { console.info(err); }
  });
};

module.exports = {
  getPlayerBio,
  getPlayerGameLog,
  playerStats
};
