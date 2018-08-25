import * as types from '../../redux/actionTypes';

export function setAllPlayers(players) {
  return {
    type: types.SET_ALL_PLAYERS,
    players
  };
}
