import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './redux/store';

import './App.css';
import ComparePlayers from './components/ComparePlayers/ComparePlayers.js';
import Header from './components/Header/Header.js';
import Home from './components/Home/Home.js';
import PlayerStats from './components/PlayerStats/PlayerStats.js';

const store = configureStore();
const baseUrl = `${window.location.origin}`;

const links = ['Home', 'SearchPlayer', 'ComparePlayers'];
const headerNames = ['Home', 'Search Player', 'Compare Players'];

const App = props => {
  return (
    <Provider store={store}>
      <BrowserRouter baseName={baseUrl}>
        <div className="App">
          <Header baseUrl={baseUrl} headerNames={headerNames} links={links}/>
          <Switch>
            <Route exact path={`/${links[0]}`} component={Home}/>
            <Route exact path={`/${links[2]}`} component={ComparePlayers}/>
            <Route exact path={`/player/:id`} component={PlayerStats}/>
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
