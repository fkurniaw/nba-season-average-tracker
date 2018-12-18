import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import * as actions from '../../redux/actionCreators/playersActions';

import './home.css';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function clearPlayerInfo(props) {
  props.setCurrentPlayer({});
  props.setPlayerBio({});
}

const Home = props => {
  const mappedLetters = letters.map(letter => {
    return <h3 className={`home-letters${letter === props.chosenLetter ? ' chosen' : ''}`} key={letter}>{letter}</h3>;
  });

  let sortedPlayers = Object.keys(props.players);
  sortedPlayers.sort((a, b) => props.players[a].title.localeCompare(props.players[b].title));
  let rows = sortedPlayers.map((id, i) => {
    return (
      <Table.Row key={props.players[id].key}>
        <Table.Cell>
          <Link to={`/players/${id}`} onClick={() => clearPlayerInfo(props)}>
            {props.players[id].title}
          </Link>
        </Table.Cell>
      </Table.Row>
    );
  });
  return (
    <div className='players-list-table'>
      <div>
        {mappedLetters}
      </div>
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
  chosenLetter: PropTypes.string,
  players: PropTypes.object,
  setCurrentPlayer: PropTypes.func,
  setPlayerBio: PropTypes.func
};

const mapStateToProps = state => {
  return {
    chosenLetter: state.ui.chosenLetter,
    players: state.players.players
  };
};

const actionCreators = {
  setCurrentPlayer: actions.setCurrentPlayer,
  setPlayerBio: actions.setPlayerBio
};

export default connect(mapStateToProps, actionCreators)(Home);
