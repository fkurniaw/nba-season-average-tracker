import React, { Component } from 'react';
import { connect } from 'react-redux';

class PlayerStats extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    console.log(this.props.params);
  }
  render() {
    return (
      <div></div>
    );
  }
}

export default connect()(PlayerStats);
