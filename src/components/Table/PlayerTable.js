import React from 'react';
import { PropTypes } from 'prop-types';

import { Table } from 'semantic-ui-react';

import './playerTable.css';

// const mapper = {
//   firstName: 'First Name',
//   lastName: 'Last Name'
// };

function formatPlayers(stats) {
  let cols = Object.keys(stats[0]);
  let header = [];
  let entries = [];
  cols.forEach(col => {
    header.push(<Table.HeaderCell key={col}>{col}</Table.HeaderCell>);
  });
  stats.forEach(player => {
    let playerCols = [];
    cols.forEach(col => {
      playerCols.push(
        <Table.Cell key={col}>
          {typeof (player[col]) === 'string' ? player[col] : JSON.stringify(player[col])}
        </Table.Cell>
      );
    });
    entries.push(
      <Table.Row key={`${player.personId}`}>
        {playerCols}
      </Table.Row>
    );
  });

  return (
    <Table className='player-table'>
      <Table.Header>
        <Table.Row>
          {header}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {entries}
      </Table.Body>
    </Table>
  );
}

const PlayerTable = props => {
  return (
    formatPlayers(props.players)
  );
};

PlayerTable.propTypes = {
  players: PropTypes.array
};

export default PlayerTable;
