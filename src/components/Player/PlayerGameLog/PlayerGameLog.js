import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';

import './playerGameLog.css';
import { Menu, Tab, Table } from 'semantic-ui-react';
import PlayerGameLogChart from './PlayerGameLogChart';
import PlayerGameLogRegular from './GameLogTypes/PlayerGameLogRegular';
import PlayerGameLogCumulativeAverage from './GameLogTypes/PlayerGameLogCumulativeAverage';

const MIN_GAMES = 15;
const MIN_INDEX = 6;

const headerCells = ['Game', 'Date', 'Matchup', 'W/L', 'Min', 'FGM', 'FGA', 'FG%',
  '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'PF', 'TOV', '+/-', 'PTS'].map(stat => {
  return (<Table.HeaderCell key={stat}className='player-game-log-cell-headers'>{stat}</Table.HeaderCell>);
});

const statsFields = ['game_date', 'matchup', 'wl', 'min', 'fgm', 'fga', 'fg_pct',
  'fg3m', 'fg3a', 'fg3_pct', 'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'pf', 'tov', 'plus_minus', 'pts'];

const cellsToSkip = ['fg_pct', 'fg3_pct', 'ft_pct']; // for game log array

class PlayerGameLog extends React.Component {
  constructor() {
    super();
    this.state = {
      gameLogTab: 1,
      loading: true
    };
  }
  componentDidMount() {
    this.props.setPlayerId(this.props.match.id);
    Sources.getGameLog(this.props.match.params.id, this.props.match.params.season).then(res => {
      this.props.setPlayerGameLog(res.data.PlayerGameLog);
      this.props.setPlayerCumulativeAverageGameLog(res.data.CumulativeAverageGameLog);
    }).catch(err => {
      console.info(err);
    });
  }
  addTable(className, headerCells, bodyRows) {
    return (
      <Table className='className' collapsing stackable>
        <Table.Header>
          <Table.Row>{headerCells}</Table.Row>
        </Table.Header>
        <Table.Body>{bodyRows}</Table.Body>
      </Table>
    );
  }
  renderCumulativeChart(type) {
    let totals = [0, 0, 0];
    let data = this.props.playerGameLog.map((game, i) => {
      switch (type) {
        case 'counting':
          totals[0] += game.pts;
          return [i + 1, totals[0] / (i + 1)];
        default:
          totals[0] += game.pts;
          return [i + 1, totals[0] / (i + 1)];
      }
    });
    return (
      <PlayerGameLogChart
        data={data}
        type={type} />
    );
  }
  renderCumulativeAverages() {
    return (
      <PlayerGameLogCumulativeAverage
        addTable={this.addTable.bind(this)}
        cellsToSkip={cellsToSkip}
        headerCells={headerCells}
        minGames={MIN_GAMES}
        minIndex={MIN_INDEX}
        statsFields={statsFields}
      />
    );
  }
  renderGameLog() {
    return (
      <PlayerGameLogRegular
        addTable={this.addTable.bind(this)}
        cellsToSkip={cellsToSkip}
        headerCells={headerCells}
        statsFields={statsFields} />
    );
  }
  renderGameLogTabs() {
    let panes = [
      {
        menuItem:
          (<Menu.Item
            className='player-game-log-menu-item'
            key={0}
            onClick={() => this.setState({ gameLogTab: 0 })}>
            Regular Season Game Log
          </Menu.Item>),
        render: () => (<Tab.Pane>{this.renderGameLog()}</Tab.Pane>)
      },
      {
        menuItem:
          (<Menu.Item
            className='player-game-log-menu-item'
            key={1}
            onClick={() => this.setState({ gameLogTab: 1 })}>
            Cumulative Season Averages Game Log
          </Menu.Item>),
        render: () => (
          <Tab.Pane>
            {this.props.playerGameLog.length > 0 && this.renderCumulativeChart('counting')}
            {this.renderCumulativeAverages()}
          </Tab.Pane>
        )
      }
    ];
    return (
      <Tab
        menu={{ color: 'blue', secondary: true, pointing: true }}
        className='player-game-log-tabs'
        defaultActiveIndex={this.state.gameLogTab}
        panes={panes}/>
    );
  }
  render() {
    return (
      <div className='player-game-log'>
        <h1>{this.props.playerName}</h1>
        {this.props.playerGameLog.length > 0 && this.renderGameLogTabs()}
      </div>
    );
  }
}

PlayerGameLog.propTypes = {
  match: PropTypes.object,
  playerCumulativeAverageGameLog: PropTypes.array,
  playerGameLog: PropTypes.array,
  playerName: PropTypes.string,
  setPlayerCumulativeAverageGameLog: PropTypes.func,
  setPlayerGameLog: PropTypes.func,
  setPlayerId: PropTypes.func
};

const mapStateToProps = state => {
  return {
    playerCumulativeAverageGameLog: state.players.playerCumulativeAverageGameLog || [],
    playerGameLog: state.players.playerGameLog || [],
    playerName: state.players.playerName
  };
};

const actionCreators = { ...actions };

export default connect(mapStateToProps, actionCreators)(PlayerGameLog);
