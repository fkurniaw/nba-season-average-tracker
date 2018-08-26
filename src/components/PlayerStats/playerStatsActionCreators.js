import * as types from '../../redux/actionTypes';

export function setCurrentPlayer(currentPlayer) {
  return {
    type: types.SET_CURRENT_PLAYER,
    currentPlayer
  };
}
