import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sources from '../../util/sources.js';

import './playerSearch.css';
import { Input } from 'semantic-ui-react';

function onChange(e) {
  this.setState({ currentInput: e.target.value });
}

function onKeyPress(e) {
  if (e.charCode === 13) {
    this.props.setState({ loading: true });
    Sources.getPlayers(this.state.currentInput).then(res => {
      this.setState({ playerList: res.data });
    });
  }
}

export default class PlayerSearch extends Component {
  constructor() {
    super();
    this.state = { currentInput: '' };
  }

  render() {
    return (
      <Input className='year-input' onChange={onChange.bind(this)} onKeyPress={onKeyPress.bind(this)}/>
    );
  }
}

PlayerSearch.propTypes = {
  setLoading: PropTypes.func
};
