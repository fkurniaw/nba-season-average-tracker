import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../util/sources';

import './playerSearch.css';
import * as actions from '../../redux/actionCreators/playersActions';
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
    this.props.setCurrentPlayer({});
    Sources.getPlayer(id).then(res => {
      this.props.setCurrentPlayer(res.data);
      this.props.setPlayerName(title);
    }).catch(err => console.info(err));
    Sources.getPlayerBio(id).then(res => {
      document.title = `NBA Cumulative Tracker - ${res.data.CommonPlayerInfo[0].display_first_last}`;
      this.props.setPlayerName(res.data.CommonPlayerInfo[0].display_first_last);
      this.props.setPlayerBio({
        headlineStats: res.data.PlayerHeadlineStats[0],
        playerInfo: res.data.CommonPlayerInfo[0]
      });
    }).catch(err => console.info(err));
  }
  componentDidMount() {
    if (this.props.players.length === 0) {
      Sources.getPlayers('2017').then(res => {
        let players = {};
        res.data.forEach((player, i) => { players[player.id] = { 'title': player.firstLast, key: `${player.firstLast}-${i}` }; });
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
    players: Object.keys(state.players.players).map(id => {
      return { id, title: state.players.players[id].title, key: state.players.players[id].key };
    })
  };
};

const actionCreators = {
  setAllPlayers: actions.setAllPlayers,
  setCurrentPlayer: actions.setCurrentPlayer,
  setPlayerBio: actions.setPlayerBio,
  setPlayerName: actions.setPlayerName
};

PlayerSearch.propTypes = {
  match: PropTypes.object,
  players: PropTypes.array,
  setAllPlayers: PropTypes.func,
  setCurrentPlayer: PropTypes.func,
  setPlayerBio: PropTypes.func,
  setPlayerName: PropTypes.func,
  setLoading: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(PlayerSearch);
