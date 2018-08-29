import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table } from 'semantic-ui-react';

const PlayerGameLogRegular = props => {
  let rows = [];
  props.playerGameLog.forEach((game, i) => {
    let cells = props.statsFields.map((field, j) => {
      let formattedStat = game[field];
      if (props.cellsToSkip.includes(j + 1)) formattedStat = !isNaN(game[field]) && game[field] !== null ? formattedStat.toFixed(3) : '-';
      else if (j > 3) formattedStat = !isNaN(game[field]) && game[field] !== null ? formattedStat : '-';
      return (
        <Table.Cell key={field} className='player-game-log-stat'>{formattedStat}</Table.Cell>
      );
    });
    rows.push(
      <Table.Row key={`game-${i}`} active={(i + 1) % 10 === 0}>
        <Table.Cell className='player-game-log-stat'>{i + 1}</Table.Cell>
        {cells}
      </Table.Row>
    );
  });
  return (
    <div className='player-game-log-table-wrapper'>
      <h3 className='player-game-log-header'>Regular Season Game Log</h3>
      {props.addTable('player-game-log-table', props.headerCells, rows)}
    </div>
  );
};

PlayerGameLogRegular.propTypes = {
  addTable: PropTypes.func,
  cellsToSkip: PropTypes.array,
  headerCells: PropTypes.array,
  playerGameLog: PropTypes.array,
  statsFields: PropTypes.array
};

const mapStateToProps = state => {
  return {
    playerGameLog: state.players.playerGameLog || []
  };
};

export default connect(mapStateToProps)(PlayerGameLogRegular);
