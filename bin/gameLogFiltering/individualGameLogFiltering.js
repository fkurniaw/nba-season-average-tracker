/**
 * Adds a percentage for corresponding shooting statistic
 * if the made and attempted counts are present, but percentage is missing
 * @param {number} made
 * @param {number} attempted
 * @param {number} percent
 */
const calculatePercentage = (made, attempted, percent) => {
    if (
        typeof made === 'number' &&
        typeof attempted === 'number' &&
        typeof percent !== 'number'
    ) {
        return made / attempted;
    }
    return percent;
};

const individualGameLogFiltering = gameLog => {
    return gameLog.map((game = {}) => {
        game.fg_pct = calculatePercentage(game.fgm, game.fga, game.fg_pct);
        game.fg3_pct = calculatePercentage(game.fg3m, game.fg3a, game.fg3_pct);
        game.ft_pct = calculatePercentage(game.ftm, game.fta, game.ft_pct);
        return game;
    });
};

module.exports = individualGameLogFiltering;
