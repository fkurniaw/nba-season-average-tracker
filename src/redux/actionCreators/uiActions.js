import * as types from '../actionTypes';

export function setChosenLetter(chosenLetter) {
  return {
    type: types.SET_CHOSEN_LETTER,
    chosenLetter
  };
}

export function setPlayerError(playerError) {
  return {
    type: types.SET_PLAYER_ERROR,
    playerError
  };
}
