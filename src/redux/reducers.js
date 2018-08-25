import { initialPlayersState } from './initialState';
import * as types from './actionTypes';

export function players(state = initialPlayersState, action) {
  switch (action.type) {
    case types.SET_ALL_PLAYERS:
      return Object.assign({}, state, { players: action.players });
    default:
      return state;
  }
}
