import * as types from '../actionTypes';

export function setAllPlayers(players) {
  return {
    type: types.SET_ALL_PLAYERS,
    players
  };
}

export function setPlayerName(playerName) {
  return {
    type: types.SET_PLAYER_NAME,
    playerName
  };
};

export function setCurrentPlayer(currentPlayer) {
  return {
    type: types.SET_CURRENT_PLAYER,
    currentPlayer
  };
}

export function setPlayerCumulativeAverageGameLog(playerCumulativeAverageGameLog) {
  return {
    type: types.SET_PLAYER_CUMULATIVE_AVERAGE_GAME_LOG,
    playerCumulativeAverageGameLog
  };
}

export function setPlayerCumulativeTotalGameLog(playerCumulativeTotalGameLog) {
  return {
    type: types.SET_PLAYER_CUMULATIVE_TOTAL_GAME_LOG,
    playerCumulativeTotalGameLog
  };
}

export function setPlayerGameLog(playerGameLog) {
  return {
    type: types.SET_PLAYER_GAME_LOG,
    playerGameLog
  };
}

export function setPlayerId(playerId) {
  return {
    type: types.SET_PLAYER_ID,
    playerId
  };
}
