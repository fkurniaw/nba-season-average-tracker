import React, { Component } from 'react';

import Sources from './util/sources.js';

import { Input, Loader } from 'semantic-ui-react';

import './App.css';
import AppMenu from './components/Menu/AppMenu.js';
import PlayerTable from './components/Table/PlayerTable.js';

function onKeyPress(e) {
  if (e.charCode === 13) {
    this.setState({ loading: true });
    Sources.getPlayers(this.state.currentInput).then(res => {
      this.setState({ playerList: res.data });
    });
  }
}

function onChange(e) {
  this.setState({ currentInput: e.target.value });
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      activeItem: 'Search Player',
      currentInput: '',
      loading: false
    };
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <AppMenu activeItem={this.state.activeItem} app={this}/>
          <h1 className="App-title">NBA Season Average Tracker</h1>
        </header>
        <Input className='year-input' onChange={onChange.bind(this)} onKeyPress={onKeyPress.bind(this)}/>
        {this.state.playerList && <PlayerTable players={this.state.playerList} />}
        {this.state.loading && <Loader />}
      </div>
    );
  }
}

export default App;
