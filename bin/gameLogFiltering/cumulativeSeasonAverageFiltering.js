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
    'ftm': 0,
    'fta': 0
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
        if (field === 'fgm') validPctTotals['fgm'] += game['fgm'] && game['fga'] ? game['fgm'] : 0;
        if (field === 'fta') validPctTotals['fga'] += game['fgm'] && game['fga'] ? game['fga'] : 0;
        if (field === 'fg3m') validPctTotals['fg3m'] += game['fg3m'] && game['fg3a'] ? game['fg3m'] : 0;
        if (field === 'fg3a') validPctTotals['fg3a'] += game['fg3m'] && game['fg3a'] ? game['fg3a'] : 0;
        if (field === 'ftm') validPctTotals['ftm'] += game['ftm'] && game['fta'] ? game['ftm'] : 0;
        if (field === 'fta') validPctTotals['fta'] += game['ftm'] && game['fta'] ? game['fta'] : 0;
        if (game[field] !== null) validCount[field]++;
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
            if (game['fgm'] !== null && game['fga'] !== null) {
              validPctTotals['fgm'] += game['fgm'];
              validPctTotals['fga'] += game['fga'];
              totals[i][field] = validPctTotals['fga'] !== 0 ? validPctTotals['fgm'] / validPctTotals['fga'] : 0;
              averages[i][field] = totals[i][field];
            } else {
              totals[i][field] = totals[i - 1][field];
              averages[i][field] = averages[i - 1][field];
            }
          } else if (field === 'fg3_pct') {
            if (game['fg3m'] !== null && game['fg3a'] !== null) {
              validPctTotals['fg3m'] += game['fg3m'];
              validPctTotals['fg3a'] += game['fg3a'];
              totals[i][field] = validPctTotals['fg3a'] !== 0 ? validPctTotals['fg3m'] / validPctTotals['fg3a'] : 0;
              averages[i][field] = totals[i][field];
            } else {
              totals[i][field] = totals[i - 1][field];
              averages[i][field] = averages[i - 1][field];
            }
          } else if (field === 'ft_pct') {
            if (game['ftm'] !== null && game['fta'] !== null) {
              validPctTotals['ftm'] += game['ftm'];
              validPctTotals['fta'] += game['fta'];
              totals[i][field] = validPctTotals['fta'] !== 0 ? validPctTotals['ftm'] / validPctTotals['fta'] : 0;
              averages[i][field] = totals[i][field];
            } else {
              totals[i][field] = totals[i - 1][field];
              averages[i][field] = averages[i - 1][field];
            }
          }
        }
      }
    });
  });
  const missingFields = { missingFieldsAverages, missingFieldsGameLog };
  return { averages, totals, missingFields };
};

module.exports = cumulativeFiltering;
