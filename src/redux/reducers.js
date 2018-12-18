import { initialComparePlayersState, initialPlayersState, initialUiState } from './initialState';
import * as types from './actionTypes';

export function comparePlayers(state = initialComparePlayersState, action) {
  switch (action.type) {
    case types.SET_COMPARE_PLAYERS_ID:
      const playerId = { [`player${action.num}Id`]: action.playerId };
      return Object.assign({}, state, playerId);
    default:
      return state;
  }
}

export function players(state = initialPlayersState, action) {
  switch (action.type) {
    case types.SET_ALL_PLAYERS:
      return Object.assign({}, state, { players: action.players });
    case types.SET_CURRENT_PLAYER:
      return Object.assign({}, state, { currentPlayer: action.currentPlayer });
    case types.SET_HIGHLIGHT_WL:
      return Object.assign({}, state, { highlightWL: action.highlightWL });
    case types.SET_MIN_INDEX:
      return Object.assign({}, state, { minIndex: action.minIndex });
    case types.SET_MISSING_FIELDS:
      return Object.assign({}, state, { missingFields: action.missingFields });
    case types.SET_PLAYER_NAME:
      return Object.assign({}, state, { playerName: action.playerName });
    case types.SET_PLAYER_BIO:
      return Object.assign({}, state, { playerBio: action.playerBio });
    case types.SET_PLAYER_CUMULATIVE_AVERAGE_GAME_LOG:
      return Object.assign({}, state, {
        [action.gameLogType]: { ...state[action.gameLogType], playerCumulativeAverageGameLog: action.playerCumulativeAverageGameLog }
      });
    case types.SET_PLAYER_CUMULATIVE_TOTAL_GAME_LOG:
      return Object.assign({}, state, {
        [action.gameLogType]: { ...state[action.gameLogType], playerCumulativeTotalGameLog: action.playerCumulativeTotalGameLog }
      });
    case types.SET_PLAYER_GAME_LOG:
      return Object.assign({}, state, {
        [action.gameLogType]: { ...state[action.gameLogType], playerGameLog: action.playerGameLog }
      });
    case types.SET_PLAYER_ID:
      return Object.assign({}, state, { playerId: action.playerId });
    default:
      return state;
  }
}

export function ui(state = initialUiState, action) {
  switch (action.type) {
    case types.SET_CHOSEN_LETTER:
      return Object.assign({}, state, { chosenLetter: action.chosenLetter });
    case types.SET_PLAYER_ERROR:
      return Object.assign({}, state, { playerError: action.playerError });
    default:
      return state;
  }
}
