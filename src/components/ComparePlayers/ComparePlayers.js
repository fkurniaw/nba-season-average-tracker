import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import * as actions from '../../redux/actionCreators/comparePlayersActions';
import { Search } from 'semantic-ui-react';

import './comparePlayers.css';

const MAX_RESULTS = 5;

function filterResults(players, currentInput) {
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
          onResultSelect={(e, data) => this.props.setPlayerId(data.result.id, 'One')}
          onSearchChange={e => this.setState({ inputOne: e.target.value })}
          results={filterResults(this.props.players, this.state.inputOne)}/>}
        Player 2: {<Search
          className='compare-players-search'
          onResultSelect={(e, data) => this.props.setPlayerId(data.result.id, 'Two')}
          onSearchChange={e => this.setState({ inputTwo: e.target.value })}
          results={filterResults(this.props.players, this.state.inputTwo)}/>}
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
  setPlayerId: actions.setPlayerId
};

ComparePlayers.propTypes = {
  players: PropTypes.array,
  setPlayerId: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(ComparePlayers);
