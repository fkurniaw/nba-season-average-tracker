import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table } from 'semantic-ui-react';

import './playerGameLogTable.css';

const PlayerGameLogGeneric = props => {
  let rows = [];
  props.playerGameLog.forEach((game, i) => {
    let cells = props.statsFields.map((field, j) => {
      let formattedStat = game[field];
      if (props.cellsToSkip.includes(field)) formattedStat = !isNaN(game[field]) && game[field] !== null ? formattedStat.toFixed(3) : '-';
      else if (j > 3) formattedStat = !isNaN(game[field]) && game[field] !== null ? formattedStat : '-';
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
  return (
    <div className='player-game-log-table-wrapper'>
      <h3 className='player-game-log-header'>{props.title}</h3>
      {props.addTable('player-game-log-table', props.headerCells, rows)}
    </div>
  );
};

PlayerGameLogGeneric.propTypes = {
  addTable: PropTypes.func,
  cellsToSkip: PropTypes.array,
  headerCells: PropTypes.array,
  playerGameLog: PropTypes.array,
  statsFields: PropTypes.array,
  title: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  return {
    playerGameLog: ownProps.type === 'totals' ? state.players.playerCumulativeTotalGameLog || []
      : state.players.playerGameLog || []
  };
};

export default connect(mapStateToProps)(PlayerGameLogGeneric);
