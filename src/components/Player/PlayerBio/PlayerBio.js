import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';

class PlayerBio extends Component {
  componentDidMount() {
    Sources.getPlayerBio(this.props.id).then(res => {
      actions.setPlayerBio(res.data);
    }).catch(err => console.info(err));
  }
  render() {
    return (
      <div className='player-bio'>
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
  id: PropTypes.string
};

export default connect(mapStateToProps, actionCreators)(PlayerBio);
