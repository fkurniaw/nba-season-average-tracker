import * as types from '../actionTypes';

export function setAllPlayers(players) {
    return {
        type: types.SET_ALL_PLAYERS,
        players,
    };
}

export function setHighlightWL(highlightWL) {
    return {
        type: types.SET_HIGHLIGHT_WL,
        highlightWL,
    };
}

export function setMinIndex(minIndex) {
    return {
        type: types.SET_MIN_INDEX,
        minIndex,
    };
}

export function setMissingFields(missingFields) {
    return {
        type: types.SET_MISSING_FIELDS,
        missingFields,
    };
}

export function setPlayerBio(playerBio) {
    return {
        type: types.SET_PLAYER_BIO,
        playerBio,
    };
}

export function setPlayerName(playerName) {
    return {
        type: types.SET_PLAYER_NAME,
        playerName,
    };
}

export function setCurrentPlayer(currentPlayer) {
    return {
        type: types.SET_CURRENT_PLAYER,
        currentPlayer,
    };
}

export function setPlayerCumulativeAverageGameLog(
    playerCumulativeAverageGameLog,
    gameLogType
) {
    return {
        type: types.SET_PLAYER_CUMULATIVE_AVERAGE_GAME_LOG,
        playerCumulativeAverageGameLog,
        gameLogType,
    };
}

export function setPlayerCumulativeTotalGameLog(
    playerCumulativeTotalGameLog,
    gameLogType
) {
    return {
        type: types.SET_PLAYER_CUMULATIVE_TOTAL_GAME_LOG,
        playerCumulativeTotalGameLog,
        gameLogType,
    };
}

export function setPlayerGameLog(playerGameLog, gameLogType) {
    return {
        type: types.SET_PLAYER_GAME_LOG,
        playerGameLog,
        gameLogType,
    };
}

export function setPlayerId(playerId) {
    return {
        type: types.SET_PLAYER_ID,
        playerId,
    };
}
