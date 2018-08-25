import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../util/sources';

import './playerSearch.css';
import * as actions from './playerSearchActionCreators';
import { Search } from 'semantic-ui-react';

function onChange(e) {
  this.setState({ currentInput: e.target.value });
}

function onKeyPress(e) {
  if (e.charCode === 13) {}
}

class PlayerSearch extends Component {
  constructor() {
    super();
    this.state = { currentInput: '' };
  }
  componentDidMount() {
    if (this.props.players.length === 0) {
      Sources.getPlayers(this.state.currentInput).then(res => {
        this.props.setAllPlayers(res.data);
      }).catch(err => {
        if (err) console.info('Network Error');
      });
    }
  }
  render() {
    return (
      <Search
        className='year-input'
        onChange={onChange.bind(this)}
        onKeyPress={onKeyPress.bind(this)}
        values={this.props.players}/>
    );
  }
}

const mapStateToProps = state => {
  return {
    players: state.players.players
  };
};

const actionCreators = { ...actions };

PlayerSearch.propTypes = {
  players: PropTypes.array,
  setAllPlayers: PropTypes.func,
  setLoading: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(PlayerSearch);
