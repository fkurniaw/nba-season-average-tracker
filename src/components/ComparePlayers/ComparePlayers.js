import React, { Component } from 'react';

import { Input } from 'semantic-ui-react';

export default class ComparePlayers extends Component {
  render() {
    return (
      <div>
        Player 1: {<Input />}
        Player 2: {<Input />}
      </div>
    );
  }
}
