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

  let sortedPlayers = props.players;
  let rows = sortedPlayers.map((player, i) => {
    return (
      <Table.Row key={player.key}>
        <Table.Cell>
          <Link to={`/players/${player.id}`} onClick={() => clearPlayerInfo(props)}>
            {player.lastFirst}
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
  players: PropTypes.array,
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
