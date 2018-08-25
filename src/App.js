import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './redux/store';

import './App.css';
import AppMenu from './components/Menu/AppMenu.js';
import ComparePlayers from './components/ComparePlayers/ComparePlayers.js';
import Home from './components/Home/Home.js';
import PlayerSearch from './components/PlayerSearch/PlayerSearch';

const store = configureStore();

const links = ['Home', 'SearchPlayer', 'ComparePlayers'];
const headerNames = ['Home', 'Search Player', 'Compare Players'];

class App extends Component {
  constructor() {
    super();
    this.state = {
      activeItem: 0,
      loading: false
    };
  }
  componentDidMount() {
    // Sources.getPlayers(this.state.currentInput).then(res => {
    //   let players = res.data.map(player => {
    //     return {
    //       id: player.person_id,
    //       nameLastFirst: player.display_last_comma_first,
    //       nameFirstLast: player.display_first_last
    //     };
    //   });
    //   this.props.setAllPlayers(players);
    // }).catch(err => {
    //   if (err) console.info('Network Error');
    // });
  }
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <header className="App-header">
              <AppMenu activeItem={this.state.activeItem} app={this} links={links}/>
              <div className='App-title-wrapper'>
                <h1 className="App-title">{headerNames[this.state.activeItem]}</h1>
              </div>
            </header>
            <Switch>
              <Route path={`/${links[0]}`} component={Home}/>
              <Route path={`/${links[1]}`} component={PlayerSearch}/>
              <Route path={`/${links[2]}`} component={ComparePlayers}/>
            </Switch>
          </div>
        </ BrowserRouter>
      </Provider>
    );
  }
}

export default App;
