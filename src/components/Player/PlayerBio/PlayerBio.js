import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';

import './playerBio.css';

class PlayerBio extends Component {
  componentDidMount() {
    Sources.getPlayerBio(this.props.id).then(res => {
      this.props.setPlayerName(res.data.CommonPlayerInfo[0].display_first_last);
      this.props.setPlayerBio({
        headlineStats: res.data.PlayerHeadlineStats[0],
        playerInfo: res.data.CommonPlayerInfo[0]
      });
    }).catch(err => console.info(err));
  }
  render() {
    return (
      <div className='player-bio'>
        <h5 className='player-bio-left-headers'>Birth Date:</h5>
        <span>{this.props.playerBio.playerInfo ? this.props.playerBio.playerInfo.birthdate.slice(0, 10) : ''}</span>
        <h5 className='player-bio-left-headers'>School:</h5>
        <span>{this.props.playerBio.playerInfo ? this.props.playerBio.playerInfo.school : ''}</span>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    playerBio: state.players.playerBio
  };
};

const actionCreators = {
  setPlayerBio: actions.setPlayerBio,
  setPlayerName: actions.setPlayerName
};

PlayerBio.propTypes = {
  id: PropTypes.string,
  playerBio: PropTypes.object,
  setPlayerBio: PropTypes.func,
  setPlayerName: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(PlayerBio);
