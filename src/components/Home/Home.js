import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import './home.css';

const Home = props => {
  let sortedPlayers = Object.keys(props.players);
  sortedPlayers.sort((a, b) => props.players[a].title.localeCompare(props.players[b].title));
  let rows = sortedPlayers.map((id, i) => {
    return (
      <Table.Row key={props.players[id].key}>
        <Table.Cell>
          <Link to={`/players/${id}`}>
            {props.players[id].title}
          </Link>
        </Table.Cell>
      </Table.Row>
    );
  });
  return (
    <div className='players-list-table'>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Player</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows}
        </Table.Body>
      </Table>
    </div>
  );
};

Home.propTypes = {
  players: PropTypes.object
};

const mapStateToProps = state => {
  return {
    players: state.players.players
  };
};

export default connect(mapStateToProps)(Home);
