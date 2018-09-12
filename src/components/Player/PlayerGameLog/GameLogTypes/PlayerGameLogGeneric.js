import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table } from 'semantic-ui-react';

import './playerGameLogTable.css';
import PlayerGameLogMinIndexDropdown from '../GameLogUtils/PlayerGameLogMinIndexDropdown';
import PlayerGameLogHighlightWL from '../GameLogUtils/PlayerGameLogHighlightWL';

const indexesToSkip = [7, 10, 13];

const PlayerGameLogGeneric = props => {
  let rows = [];
  let maxes = [];
  if (props.type !== 'totals' && props.playerGameLog.length > props.minGames) { // disable highlighting for season totals
    for (let i = 0; i < props.statsFields.length - 3; i++) maxes.push({ val: -Infinity, row: [0] });
  }
  props.playerGameLog.forEach((game, i) => {
    let cells = props.statsFields.map((field, j) => {
      let formattedStat = game[field];
      if (props.cellsToSkip.includes(field)) formattedStat = !isNaN(game[field]) && game[field] !== null ? formattedStat.toFixed(3) : '-';
      else if (j > 2) {
        formattedStat = !isNaN(game[field]) && game[field] !== null ? formattedStat : '-';
        if (formattedStat !== '-' && game.game_num >= props.minIndex && props.type !== 'totals' && maxes.length > 0) {
          if (formattedStat > maxes[j - 3].val && ((formattedStat !== 0 && field !== 'plus_minus') || field === 'plus_minus')) {
            maxes[j - 3].val = formattedStat;
            maxes[j - 3].row = [i]; // row represents game number
          } else if (formattedStat === maxes[j - 3].val) maxes[j - 3].row.push(i); // store all occurrences of same career high
        }
      }
      let className = 'player-game-log-stat';
      if (field === 'wl' && props.highlightWL) {
        if (formattedStat === 'W') className = 'player-game-log-stat-good';
        else if (formattedStat === 'L') className = 'player-game-log-stat-bad';
      }
      return (
        <Table.Cell key={field} className={className}>{formattedStat}</Table.Cell>
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
      <div className='player-game-log-options'>
        {<PlayerGameLogHighlightWL />}
        {props.playerGameLog.length > props.minGames && props.type !== 'totals' && <PlayerGameLogMinIndexDropdown seasonType={props.seasonType}/>}
      </div>
      {props.addTable('player-game-log-table', props.headerCells, rows)}
    </div>
  );
};

PlayerGameLogGeneric.propTypes = {
  addTable: PropTypes.func,
  cellsToSkip: PropTypes.array,
  headerCells: PropTypes.array,
  highlightWL: PropTypes.bool,
  minGames: PropTypes.number,
  minIndex: PropTypes.number,
  playerGameLog: PropTypes.array,
  seasonType: PropTypes.string,
  statsFields: PropTypes.array,
  title: PropTypes.string,
  type: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  return {
    highlightWL: state.players.highlightWL,
    minIndex: typeof (state.players.minIndex) === 'number' ? state.players.minIndex : 6,
    playerGameLog: ownProps.type === 'totals' ? state.players[ownProps.seasonType].playerCumulativeTotalGameLog || []
      : state.players[ownProps.seasonType].playerGameLog || []
  };
};

export default connect(mapStateToProps)(PlayerGameLogGeneric);
