import * as types from '../actionTypes';

export function setPlayerError(playerError) {
  return {
    type: types.SET_PLAYER_ERROR,
    playerError
  };
}
