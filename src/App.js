import React from 'react';
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './redux/store';

import './App.css';
import ComparePlayers from './components/ComparePlayers/ComparePlayers.js';
import Header from './components/Header/Header.js';
import Home from './components/Home/Home.js';
import PlayerBio from './components/Player/PlayerBio/PlayerBio.js';
import PlayerStats from './components/Player/PlayerStats/PlayerStats.js';
import PlayerGameLog from './components/Player/PlayerGameLog/PlayerGameLog.js';

const store = configureStore();
const baseUrl = `${window.location.origin}`;

const links = ['Home', 'SearchPlayer', 'ComparePlayers'];
const headerNames = ['Home', 'Search Player', 'Compare Players'];

const WrappedHeader = withRouter(({ history }) => (
  <Header baseUrl={baseUrl} headerNames={headerNames} links={links} history={history}/>
));

const App = props => { // TODO: add nested routes for game log
  return (
    <Provider store={store}>
      <BrowserRouter baseName={baseUrl}>
        <div className="App">
          <WrappedHeader />
          <div className='App-contents'>
            <Switch>
              <Route exact path={`/${links[0]}`} component={Home}/>
              <Route exact path={`/${links[2]}`} component={ComparePlayers}/>
              <Route exact path={`/players/:id`}
                render={({ match }) => <div><PlayerBio id={match.params.id}/><PlayerStats id={match.params.id} match={match}/></div>}/>
              <Route exact path={`/players/:id/gamelog/:season`}
                render={({ match }) => <div><PlayerBio id={match.params.id}/><PlayerGameLog id={match.params.id} match={match}/></div>}/>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
