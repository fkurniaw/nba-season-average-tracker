import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table } from 'semantic-ui-react';

import './playerGameLogTable.css';
import PlayerGameLogMinIndexDropdown from './PlayerGameLogMinIndexDropdown';

const indexesToSkip = [7, 10, 13];

const PlayerGameLogGeneric = props => {
  let rows = [];
  let maxes = [];
  if (props.type !== 'totals' && props.playerGameLog.length > props.minGames) {
    for (let i = 0; i < props.statsFields.length - 3; i++) maxes.push({ val: -Infinity, row: [0] });
  }
  props.playerGameLog.forEach((game, i) => {
    let cells = props.statsFields.map((field, j) => {
      let formattedStat = game[field];
      if (props.cellsToSkip.includes(field)) formattedStat = !isNaN(game[field]) && game[field] !== null ? formattedStat.toFixed(3) : '-';
      else if (j > 2) {
        formattedStat = !isNaN(game[field]) && game[field] !== null ? formattedStat : '-';
        if (formattedStat !== '-' && game.game_num >= props.minIndex) {
          if (formattedStat > maxes[j - 3].val) {
            maxes[j - 3].val = formattedStat;
            maxes[j - 3].row[0] = i; // row represents game number
          } else if (formattedStat === maxes[j - 3].val) maxes[j - 3].row.push(i); // store all occurrences of same career high
        }
      }
      return (
        <Table.Cell key={field} className='player-game-log-stat'>{formattedStat}</Table.Cell>
      );
    });
    rows.push(
      <Table.Row key={`game-${i}`} active={i % 20 > 9}>
        <Table.Cell className='player-game-log-stat'>{game.game_num}</Table.Cell>
        {cells}
      </Table.Row>
    );
  });

  if (maxes.length > 0) {
    maxes.forEach((maxIndex, i) => {
      if (maxIndex.val === -Infinity) return;
      let isGood = i === maxes.length - 3 || i === maxes.length - 4 ? 'bad' : 'good';
      maxIndex.row.forEach(maxIndexRow => {
        rows[maxIndexRow].props.children[1][i + 3] = ( // i + 4 since first 3 fields of array are date, matchup, and W/L
          <Table.Cell className={`player-game-log-stat-${isGood}`} key={i + 4}>
            {maxIndex.val.toFixed(indexesToSkip.includes(i + 4) ? 3 : 0)}
          </Table.Cell>
        );
      });
    });
  }
  return (
    <div className='player-game-log-table-wrapper'>
      <h3 className='player-game-log-header'>{props.title}</h3>
      {props.playerGameLog.length > 9 && <PlayerGameLogMinIndexDropdown />}
      {props.addTable('player-game-log-table', props.headerCells, rows)}
    </div>
  );
};

PlayerGameLogGeneric.propTypes = {
  addTable: PropTypes.func,
  cellsToSkip: PropTypes.array,
  headerCells: PropTypes.array,
  minGames: PropTypes.number,
  minIndex: PropTypes.number,
  playerGameLog: PropTypes.array,
  statsFields: PropTypes.array,
  title: PropTypes.string,
  type: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  return {
    minIndex: typeof (state.players.minIndex) === 'number' ? state.players.minIndex - 1 : 6,
    playerGameLog: ownProps.type === 'totals' ? state.players.playerCumulativeTotalGameLog || []
      : state.players.playerGameLog || []
  };
};

export default connect(mapStateToProps)(PlayerGameLogGeneric);
