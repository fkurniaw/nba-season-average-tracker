import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { Loader } from 'semantic-ui-react';
import configureStore from './redux/store';

import './App.css';
import AppMenu from './components/Menu/AppMenu.js';
import PlayerSearch from './components/PlayerSearch/PlayerSearch';
import PlayerTable from './components/Table/PlayerTable.js';

const store = configureStore();

class App extends Component {
  constructor() {
    super();
    this.state = {
      activeItem: 'Home',
      loading: false
    };
  }
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <AppMenu activeItem={this.state.activeItem} app={this}/>
            <h1 className="App-title">NBA Season Average Tracker</h1>
          </header>
          <PlayerSearch setLoading={this.setState.bind(this)} />
          {this.state.playerList && <PlayerTable players={this.state.playerList} />}
          {this.state.loading && <Loader />}
        </div>
      </Provider>
    );
  }
}

export default App;
