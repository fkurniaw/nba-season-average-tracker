const statFields = ['game_date', 'matchup', 'wl', 'min', 'fgm', 'fga', 'fg_pct',
  'fg3m', 'fg3a', 'fg3_pct', 'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'pf', 'tov', 'plus_minus', 'pts'];

const cellsToSkip = ['fg_pct', 'fg3_pct', 'ft_pct'];
const nonAvgFieldsIndex = 3;

const cumulativeFiltering = function(playerGameLog) {
  let averages = [];
  let totals = [];
  let validCount = {};
  statFields.forEach(field => {
    validCount[field] = 0;
  });
  let missingFieldsAverages = {};
  let missingFieldsGameLog = {};
  playerGameLog.forEach((game, i) => {
    averages[i] = {};
    totals[i] = {};
    averages[i].game_num = i + 1;
    totals[i].game_num = i + 1;
    statFields.forEach((field, j) => {
      if (i === 0 || j < nonAvgFieldsIndex) {
        totals[i][field] = game[field];
        averages[i][field] = game[field];
      } else if (game[field] === null) {
        missingFieldsAverages[field] = true;
        missingFieldsGameLog[field] = true;
        totals[i][field] = totals[i - 1][field];
        averages[i][field] = i > 0 ? averages[i - 1][field] || null : null;
      } else {
        validCount[field]++;
        if (!cellsToSkip.includes(field)) {
          totals[i][field] = totals[i - 1][field] + game[field];
          averages[i][field] = (averages[i - 1][field] * ((validCount[field] - 1) / validCount[field])) + (game[field] * (1 / validCount[field]));
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
  const missingFields = { missingFieldsAverages, missingFieldsGameLog };
  return { averages, totals, missingFields };
};

module.exports = cumulativeFiltering;
