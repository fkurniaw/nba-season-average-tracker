export const initialComparePlayersState = {
    playerOneId: null,
    playerTwoId: null,
};
export const initialPlayersState = {
    currentPlayer: {},
    highlightWL: true,
    minIndex: 6,
    missingFields: {},
    players: [],
    playerBio: {},
    playerName: '',
    postSeason: {
        playerGameLog: [],
        playerCumulativeAverageGameLog: [],
        playerCumulativeTotalGameLog: [],
    },
    regularSeason: {
        playerGameLog: [],
        playerCumulativeAverageGameLog: [],
        playerCumulativeTotalGameLog: [],
    },
};
export const initialUiState = {
    chosenLetter: 'A',
    playerError: false,
};
