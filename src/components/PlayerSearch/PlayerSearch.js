import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

  render() {
    return (
      <Search className='year-input' onChange={onChange.bind(this)} onKeyPress={onKeyPress.bind(this)}/>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const actionCreators = { ...actions };

PlayerSearch.propTypes = {
  setAllPlayers: PropTypes.func,
  setLoading: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(PlayerSearch);
