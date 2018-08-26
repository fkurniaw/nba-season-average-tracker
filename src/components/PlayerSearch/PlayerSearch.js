import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../util/sources';

import './playerSearch.css';
import * as actions from './playerSearchActionCreators';
import { setCurrentPlayer } from '../PlayerStats/playerStatsActionCreators';
import { Link } from 'react-router-dom';
import { Search } from 'semantic-ui-react';

const placeholder = 'Enter a player name';
const MAX_RESULTS = 5;

function onSearchChange(e) {
  this.setState({ currentInput: e.target.value });
}

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
            <Link to={`/players/${players[i].id}`}
              onClick={() => setCurrentPlayer(players[i].id, players[i].title)}
              className='player-search-link'>{players[i].title}</Link>
          );
        }
      });
    }
    if (results.length > MAX_RESULTS) break;
  }
  return results;
}

class PlayerSearch extends Component {
  constructor() {
    super();
    this.state = { currentInput: '' };
  }
  setCurrentPlayer(id, title) {
    Sources.getPlayer(id).then(res => {
      this.props.setCurrentPlayer(res.data);
      this.props.setPlayerName(title);
    });
  }
  componentDidMount() {
    if (this.props.players.length === 0) {
      Sources.getPlayers('2017').then(res => {
        let players = res.data.map((player, i) => {
          return { title: player.firstLast, id: player.id, key: `${player.firstLast}-${i}` };
        });
        this.props.setAllPlayers(players);
      }).catch(err => {
        if (err) console.info('Network Error');
      });
    }
  }
  render() {
    return (
      <Search
        className='year-input'
        placeholder={placeholder}
        onSearchChange={onSearchChange.bind(this)}
        results={filterResults(this.props.players, this.state.currentInput, this.setCurrentPlayer.bind(this))}/>
    );
  }
}

const mapStateToProps = state => {
  return {
    players: state.players.players
  };
};

const actionCreators = { ...actions, setCurrentPlayer };

PlayerSearch.propTypes = {
  players: PropTypes.array,
  setAllPlayers: PropTypes.func,
  setCurrentPlayer: PropTypes.func,
setPlayerName: PropTypes.func,
  setLoading: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(PlayerSearch);
