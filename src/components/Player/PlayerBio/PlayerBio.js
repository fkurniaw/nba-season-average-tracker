import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';
import * as uiActions from '../../../redux/actionCreators/uiActions';

import './playerBio.css';

import { Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const bioHeadersMap = {
  'years_active': 'Period Active',
  'birthdate': 'Birth Date',
  'country': 'Country',
  'school': 'School/From',
  'height': 'Height (inches)',
  'weight': 'Weight (lbs)',
  'position': 'Position',
  'draft': 'Draft'
};

class PlayerBio extends Component {
  componentDidMount() {
    Sources.getPlayerBio(this.props.id).then(res => {
      if (res.data.error) {
        this.props.setPlayerError(true);
        return;
      }
      this.props.setPlayerError(false);
      document.title = `NBA Cumulative Tracker - ${res.data.CommonPlayerInfo[0].display_first_last}`;
      this.props.setPlayerName(res.data.CommonPlayerInfo[0].display_first_last);
      this.props.setPlayerBio({
        headlineStats: res.data.PlayerHeadlineStats[0],
        playerInfo: res.data.CommonPlayerInfo[0]
      });
    }).catch(err => console.info(err));
  }
  addBioHeaders() {
    let headers = [];
    Object.keys(bioHeadersMap).forEach(header => {
      headers.push(
        <div className='player-bio-header' key={header}>
          <h5 className='player-bio-left-headers'>{bioHeadersMap[header]}:</h5>
          <span>{this.props.playerInfo[header]}</span>
        </div>
      );
    });
    return headers;
  }
  render() {
    return (
      <div className='player-bio'>
        {!this.props.playerError ? <div>
          <h1 className='player-bio-name'>
            <Link to={`/players/${this.props.id}`}
              className='player-bio-name-link'>
              {this.props.playerName}
            </Link>
          </h1>
          {Object.keys(this.props.playerInfo).length > 0 ? this.addBioHeaders() : <Loader active style={{ minHeight: '30px' }}/>}
          <hr className='bio-divider'/>
        </div> : <h2>Error while fetching player.</h2>}
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    headlineStats: state.players.playerBio.headlineStats || {},
    id: ownProps.id,
    playerError: state.uiState.playerError,
    playerInfo: state.players.playerBio.playerInfo || {},
    playerName: state.players.playerName || ''
  };
};

const actionCreators = {
  setPlayerBio: actions.setPlayerBio,
  setPlayerError: uiActions.setPlayerError,
  setPlayerName: actions.setPlayerName
};

PlayerBio.propTypes = {
  headlineStats: PropTypes.object,
  id: PropTypes.string,
  playerError: PropTypes.bool,
  playerInfo: PropTypes.object,
  playerName: PropTypes.string,
  setPlayerBio: PropTypes.func,
  setPlayerError: PropTypes.func,
  setPlayerName: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(PlayerBio);
