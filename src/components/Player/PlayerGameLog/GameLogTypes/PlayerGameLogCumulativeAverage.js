import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table } from 'semantic-ui-react';

const indexesToSkip = [7, 10, 13]; // for maxes array

const PlayerGameLogCumulativeAverage = props => {
  let maxes = []; // style cells with max values
  for (let i = 0; i < props.statsFields.length - 3; i++) maxes.push({ val: -Infinity, row: 0 });

  let rows = props.playerCumulativeAverageGameLog.map((game, i) => {
    let cells = [<Table.Cell key={0} className='player-game-log-stat'>{i + 1}</Table.Cell>]; // initial game
    props.statsFields.forEach((field, j) => { // add all stats other than game number
      // store max val for each cell after 10 games; skip the first 3 columns (date, matchup, W/L)
      if (j > 2 && props.playerCumulativeAverageGameLog.length > props.minGames && i >= props.minIndex && game[field] !== null && maxes[j - 3].val <= game[field]) {
        // store the latest occurrence of the game log high
        maxes[j - 3].val = game[field];
        maxes[j - 3].row = i;
      };
      let formattedField = j < 3 ? game[field] : game[field] !== null ? game[field].toFixed(props.cellsToSkip.includes(field) ? 3 : 1) : '-'; // round percentages to 3 decimal places
      cells[j + 1] = (<Table.Cell className='player-game-log-stat' key={j + 1}>{formattedField}</Table.Cell>);
    });

    return (
      <Table.Row key={i} active={i % 20 > 9}>{cells}</Table.Row>
    );
  });

  maxes.forEach((maxIndex, i) => { // rewrite cells to change className since className is read-only
    if (maxIndex.val === -Infinity) return;
    let isGood = i === maxes.length - 3 || i === maxes.length - 4 ? 'bad' : 'good';
    rows[maxIndex.row].props.children[i + 4] = (
      <Table.Cell className={`player-game-log-stat-${isGood}`} key={i + 4}>
        {maxIndex.val.toFixed(indexesToSkip.includes(i + 4) ? 3 : 1)}
      </Table.Cell>
    );
  });

  return (
    <div className='player-game-log-table-wrapper'>
      <h3 className='player-game-log-header'>Cumulative Season Average Game Log</h3>
      {props.addTable('player-game-log-table', props.headerCells, rows)}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    playerCumulativeAverageGameLog: state.players.playerCumulativeAverageGameLog || []
  };
};

PlayerGameLogCumulativeAverage.propTypes = {
  addTable: PropTypes.func,
  cellsToSkip: PropTypes.array,
  headerCells: PropTypes.array,
  minGames: PropTypes.number,
  minIndex: PropTypes.number,
  playerCumulativeAverageGameLog: PropTypes.array,
  statsFields: PropTypes.array
};

export default connect(mapStateToProps)(PlayerGameLogCumulativeAverage);
