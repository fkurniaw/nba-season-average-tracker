const statFields = ['game_date', 'matchup', 'wl', 'min', 'fgm', 'fga', 'fg_pct',
  'fg3m', 'fg3a', 'fg3_pct', 'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'pf', 'tov', 'plus_minus', 'pts'];

const cellsToSkip = ['fg_pct', 'fg3_pct', 'ft_pct'];
const nonAvgFieldsIndex = 3;

const cumulativeFiltering = function(playerGameLog) {
  let averages = [];
  let totals = [];
  let validCount = {}; // for tracking averages of normal counting stats when some are missing (prevents average from dropping in case of missed stat)
  let validPctTotals = {
    'fgm': 0,
    'fga': 0,
    'fg3m': 0,
    'fg3a': 0,
    'ftm': 0,
    'fta': 0,
    'pts': 0 // for tracking TS%
  }; // for tracking percentage stats when some field goal stats are missing
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
        if (field === 'fgm') validPctTotals['fgm'] += game['fgm'] !== null && game['fga'] !== null ? game['fgm'] : 0;
        if (field === 'fga') validPctTotals['fga'] += game['fgm'] !== null && game['fga'] !== null ? game['fga'] : 0;
        if (field === 'fg3m') validPctTotals['fg3m'] += game['fg3m'] !== null && game['fg3a'] !== null ? game['fg3m'] : 0;
        if (field === 'fg3a') validPctTotals['fg3a'] += game['fg3m'] !== null && game['fg3a'] !== null ? game['fg3a'] : 0;
        if (field === 'ftm') validPctTotals['ftm'] += game['ftm'] !== null && game['fta'] !== null ? game['ftm'] : 0;
        if (field === 'fta') validPctTotals['fta'] += game['ftm'] !== null && game['fta'] !== null ? game['fta'] : 0;
        if (game[field] !== null) validCount[field]++;
      } else if (game[field] === null && !cellsToSkip.includes(field)) {
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
          if (field === 'fg_pct') calculatePercentages(i, field, 'fgm', 'fga', game, validPctTotals, totals, averages);
          else if (field === 'fg3_pct') calculatePercentages(i, field, 'fg3m', 'fg3a', game, validPctTotals, totals, averages);
          else if (field === 'ft_pct') calculatePercentages(i, field, 'ftm', 'fta', game, validPctTotals, totals, averages);
        }
      }
    });
  });
  const missingFields = { missingFieldsAverages, missingFieldsGameLog };
  return { averages, totals, missingFields };
};

function calculatePercentages(gameNum, pctType, makes, attempts, game, validPctTotals, totals, averages) {
  if (game[makes] !== null && game[attempts] !== null) {
    validPctTotals[makes] += game[makes];
    validPctTotals[attempts] += game[attempts];
    totals[gameNum][pctType] = validPctTotals[attempts] !== 0 ? validPctTotals[makes] / validPctTotals[attempts] : 0;
    averages[gameNum][pctType] = totals[gameNum][pctType];
  } else {
    totals[gameNum][pctType] = totals[gameNum - 1][pctType]; // retain previous average calculation
    averages[gameNum][pctType] = averages[gameNum - 1][pctType];
  }
}

module.exports = cumulativeFiltering;
