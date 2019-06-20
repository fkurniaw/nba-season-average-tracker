import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './playerGameLogTable.css';
import { Table } from 'semantic-ui-react';
import PlayerGameLogMinIndexDropdown from '../GameLogUtils/PlayerGameLogMinIndexDropdown';
import PlayerGameLogHighlightWL from '../GameLogUtils/PlayerGameLogHighlightWL';

const indexesToSkip = [7, 10, 13]; // for maxes array

const PlayerGameLogCumulativeAverage = props => {
    let maxes = []; // style cells with max values
    for (let i = 0; i < props.statsFields.length - 3; i++)
        maxes.push({ val: -Infinity, row: 0 });

    let rows = props.playerCumulativeAverageGameLog.map((game, i) => {
        let cells = [
            <Table.Cell key={0} className="player-game-log-stat">
                {game.game_num}
            </Table.Cell>,
        ]; // initial game
        props.statsFields.forEach((field, j) => {
            // add all stats other than game number
            // store max val for each cell after 10 games; skip the first 3 columns (date, matchup, W/L)
            if (
                j > 2 &&
                props.playerCumulativeAverageGameLog.length > props.minGames &&
                game.game_num >= props.minIndex &&
                game[field] !== null &&
                maxes[j - 3].val <= game[field] &&
                ((game[field] !== 0 && field !== 'plus_minus') ||
                    field === 'plus_minus')
            ) {
                // store the latest occurrence of the game log high
                maxes[j - 3].val = game[field];
                maxes[j - 3].row = i;
            }
            let formattedField =
                j < 3
                    ? game[field]
                    : game[field] !== null
                    ? game[field].toFixed(
                          props.cellsToSkip.includes(field) ? 3 : 1
                      )
                    : '-'; // round percentages to 3 decimal places
            let className = 'player-game-log-stat';
            if (field === 'wl' && props.highlightWL) {
                if (formattedField === 'W')
                    className = 'player-game-log-stat-good';
                else if (formattedField === 'L')
                    className = 'player-game-log-stat-bad';
            }
            cells[j + 1] = (
                <Table.Cell className={className} key={j + 1}>
                    {formattedField}
                </Table.Cell>
            ); // first field is game num
        });
        return (
            <Table.Row key={i} active={i % 20 > 9}>
                {cells}
            </Table.Row>
        );
    });

    maxes.forEach((maxIndex, i) => {
        // rewrite cells to change className since className is read-only
        if (maxIndex.val === -Infinity) return;
        let isGood =
            i === maxes.length - 3 || i === maxes.length - 4 ? 'bad' : 'good';
        rows[maxIndex.row].props.children[i + 4] = (
            <Table.Cell
                className={`player-game-log-stat-${isGood}`}
                key={i + 4}
            >
                {maxIndex.val.toFixed(indexesToSkip.includes(i + 4) ? 3 : 1)}
            </Table.Cell>
        );
    });

    return (
        <div className="player-game-log-table-wrapper">
            <h3 className="player-game-log-header">{props.title}</h3>
            <div className="player-game-log-options">
                {<PlayerGameLogHighlightWL />}
                {props.playerCumulativeAverageGameLog.length >
                    props.minGames && (
                    <PlayerGameLogMinIndexDropdown
                        seasonType={props.seasonType}
                    />
                )}
            </div>
            {props.isMissingAverages && (
                <p className="averages-note">
                    *If data is missing, percent averages are calculated using
                    the sum of makes and sum of attempts from games where BOTH
                    fields were present.*
                    <br />
                    *Hence, they may not correspond to career stats.*
                </p>
            )}
            {props.addTable('player-game-log-table', props.headerCells, rows)}
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    let isMissingAverages;
    if (state.players.missingFields.missingFieldsAverages) {
        for (let key in state.players.missingFields.missingFieldsAverages) {
            if (state.players.missingFields.missingFieldsAverages[key]) {
                isMissingAverages = true;
                break;
            }
        }
    }
    return {
        highlightWL: state.players.highlightWL,
        isMissingAverages:
            isMissingAverages !== undefined ? isMissingAverages : false,
        minIndex:
            typeof state.players.minIndex === 'number'
                ? state.players.minIndex
                : 6,
        playerCumulativeAverageGameLog:
            state.players[ownProps.seasonType].playerCumulativeAverageGameLog ||
            [],
    };
};

PlayerGameLogCumulativeAverage.propTypes = {
    addTable: PropTypes.func,
    cellsToSkip: PropTypes.array,
    disableHighlight: PropTypes.bool,
    headerCells: PropTypes.array,
    highlightWL: PropTypes.bool,
    isMissingAverages: PropTypes.bool,
    minGames: PropTypes.number,
    minIndex: PropTypes.number,
    playerCumulativeAverageGameLog: PropTypes.array,
    seasonType: PropTypes.string,
    statsFields: PropTypes.array,
    title: PropTypes.string,
};

export default connect(mapStateToProps)(PlayerGameLogCumulativeAverage);
