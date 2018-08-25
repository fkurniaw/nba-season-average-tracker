import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './redux/store';

import './App.css';
import ComparePlayers from './components/ComparePlayers/ComparePlayers.js';
import Header from './components/Header/Header.js';
import Home from './components/Home/Home.js';
import PlayerSearch from './components/PlayerSearch/PlayerSearch';

const store = configureStore();

const links = ['Home', 'SearchPlayer', 'ComparePlayers'];
const headerNames = ['Home', 'Search Player', 'Compare Players'];

const App = props => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Header headerNames={headerNames} links={links}/>
          <Switch>
            <Route path={`/${links[0]}`} component={Home}/>
            <Route path={`/${links[1]}`} component={PlayerSearch}/>
            <Route path={`/${links[2]}`} component={ComparePlayers}/>
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
