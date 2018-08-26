import * as types from '../../redux/actionTypes';

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
