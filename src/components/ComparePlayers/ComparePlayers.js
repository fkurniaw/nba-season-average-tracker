import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import * as actions from '../../redux/actionCreators/playersActions';
import { Search } from 'semantic-ui-react';

import './comparePlayers.css';

const MAX_RESULTS = 5;

function filterResults(players, currentInput, setCurrentPlayer) {
  let results = [];
  for (let i = 0; i < players.length; i++) {
    if (players[i].title.toLowerCase().indexOf(currentInput.toLowerCase()) > -1) {
      results.push({
        className: 'player-search-result',
        title: players[i].title,
        id: players[i].id,
        renderer: function PlayerLink() {
          return (
            <div>{players[i].title}</div>
          );
        }
      });
    }
    if (results.length > MAX_RESULTS) break;
  }
  return results;
}

class ComparePlayers extends Component {
  constructor() {
    super();
    this.state = {
      inputOne: '',
      inputTwo: ''
    };
  }
  render() {
    return (
      <div className='compare-players'>
        Player 1: {<Search
          className='compare-players-search'
          onSearchChange={e => this.setState({ inputOne: e.target.value })}
          results={filterResults(this.props.players, this.state.inputOne, this.props.setCurrentPlayer.bind(this))}/>}
        Player 2: {<Search
          className='compare-players-search'
          onSearchChange={e => this.setState({ inputTwo: e.target.value })}
          results={filterResults(this.props.players, this.state.inputTwo, this.props.setCurrentPlayer.bind(this))}/>}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    players: Object.keys(state.players.players).map(id => {
      return { id, title: state.players.players[id].title, key: state.players.players[id].key };
    })
  };
};

const actionCreators = {
  setCurrentPlayer: actions.setCurrentPlayer
};

ComparePlayers.propTypes = {
  players: PropTypes.array,
  setCurrentPlayer: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(ComparePlayers);
