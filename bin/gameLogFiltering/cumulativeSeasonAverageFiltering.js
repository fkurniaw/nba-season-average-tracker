const statFields = ['game_date', 'matchup', 'wl', 'min', 'fgm', 'fga', 'fg_pct',
  'fg3m', 'fg3a', 'fg3_pct', 'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'pf', 'tov', 'plus_minus', 'pts'];

const cellsToSkip = ['fg_pct', 'fg3_pct', 'ft_pct'];
const nonAvgFieldsIndex = 3;

const cumulativeFiltering = function(playerGameLog) {
  let averages = [];
  let totals = [];
  playerGameLog.forEach((game, i) => {
    averages[i] = {};
    totals[i] = {};
    statFields.forEach((field, j) => {
      if (i === 0 || j < nonAvgFieldsIndex) {
        totals[i][field] = game[field];
        averages[i][field] = game[field];
      } else if (game[field] === null) {
        totals[i][field] = totals[i - 1][field];
        averages[i][field] = null;
      } else {
        if (!cellsToSkip.includes(field)) {
          totals[i][field] = totals[i - 1][field] + game[field];
          averages[i][field] = (averages[i - 1][field] * ((averages.length - 1) / averages.length)) + (game[field] * (1 / averages.length));
        } else {
          if (field === 'fg_pct') {
            totals[i][field] = totals[i]['fga'] !== 0 ? totals[i]['fgm'] / totals[i]['fga'] : 0;
            averages[i][field] = totals[i][field];
          } else if (field === 'fg3_pct') {
            totals[i][field] = totals[i]['fg3a'] !== 0 ? totals[i]['fg3m'] / totals[i]['fg3a'] : 0;
            averages[i][field] = totals[i][field];
          } else if (field === 'ft_pct') {
            totals[i][field] = totals[i]['fta'] !== 0 ? totals[i]['ftm'] / totals[i]['fta'] : 0;
            averages[i][field] = totals[i][field];
          }
        }
      }
    });
  });
  return { averages, totals };
};

module.exports = cumulativeFiltering;
