import * as types from '../actionTypes';

export function setPlayerId(playerId, num) {
    return {
        type: types.SET_COMPARE_PLAYERS_ID,
        playerId,
        num,
    };
}

export function setComparePlayer() {
    return null;
}
