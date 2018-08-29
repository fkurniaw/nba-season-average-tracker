const statFields = ['game_date', 'matchup', 'wl', 'min', 'fgm', 'fga', 'fg_pct',
  'fg3m', 'fg3a', 'fg3_pct', 'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'pf', 'tov', 'plus_minus', 'pts'];

const cellsToSkip = ['fg_pct', 'fg3_pct', 'ft_pct'];
const nonAvgFieldsIndex = 3;

const cumulativeFiltering = function(playerGameLog) {
  let averages = [];
  playerGameLog.forEach((game, i) => {
    averages[i] = {};
    statFields.forEach((field, j) => {
      if (i === 0 || j < nonAvgFieldsIndex) averages[i][field] = game[field];
      else if (game[field] === null) averages[i][field] = null;
      else {
        if (!cellsToSkip.includes(field)) {
          averages[i][field] = (averages[i - 1][field] * ((averages.length - 1) / averages.length)) + (game[field] * (1 / averages.length));
        } else {
          if (field === 'fg_pct') averages[i][field] = averages[i]['fga'] !== 0 ? averages[i]['fgm'] / averages[i]['fga'] : 0;
          if (field === 'fg3_pct') averages[i][field] = averages[i]['fg3a'] !== 0 ? averages[i]['fg3m'] / averages[i]['fg3a'] : 0;
          if (field === 'ft_pct') averages[i][field] = averages[i]['fta'] !== 0 ? averages[i]['ftm'] / averages[i]['fta'] : 0;
        }
      }
    });
  });
  return averages;
};

module.exports = cumulativeFiltering;
