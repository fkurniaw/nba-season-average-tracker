import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';

import './playerGameLog.css';
import { Menu, Tab, Table } from 'semantic-ui-react';
import PlayerGameLogChart from './PlayerGameLogChart';

const MIN_GAMES = 15;
const MIN_INDEX = 6;

const headerCells = ['Game', 'Date', 'Matchup', 'W/L', 'Min', 'FGM', 'FGA', 'FG%',
  '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'PF', 'TOV', '+/-', 'PTS'].map(stat => {
  return (<Table.HeaderCell key={stat}className='player-game-log-cell-headers'>{stat}</Table.HeaderCell>);
});

const statsFields = ['game_date', 'matchup', 'wl', 'min', 'fgm', 'fga', 'fg_pct',
  'fg3m', 'fg3a', 'fg3_pct', 'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'pf', 'tov', 'plus_minus', 'pts'];

const cellsToSkip = ['fg_pct', 'fg3_pct', 'ft_pct']; // for game log array
const indexesToSkip = [7, 10, 13]; // for maxes array

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
          totals[1] += game.reb;
          totals[2] += game.ast;
          return [i + 1, totals[0] / (i + 1), totals[1] / (i + 1), totals[2] / (i + 1)];
        default:
          totals[0] += game.pts;
          totals[1] += game.reb;
          totals[2] += game.ast;
          return [i + 1, totals[0] / (i + 1), totals[1] / (i + 1), totals[2] / (i + 1)];
      }
    });
    return (
      <PlayerGameLogChart
        data={data}
        type={type} />
    );
  }
  renderCumulativeAverages() {
    let maxes = []; // style cells with max values
    for (let i = 0; i < statsFields.length - 3; i++) maxes.push({ val: -Infinity, row: 0 });

    let rows = this.props.playerCumulativeAverageGameLog.map((game, i) => {
      let cells = [<Table.Cell key={0} active={(i + 1) % 10 === 0}>{i + 1}</Table.Cell>]; // initial game
      statsFields.forEach((field, j) => { // add all stats other than game number
        // store max val for each cell after 10 games; skip the first 3 columns (date, matchup, W/L)
        if (j > 2 && this.props.playerCumulativeAverageGameLog.length > MIN_GAMES && i >= MIN_INDEX && game[field] !== null && maxes[j - 3].val <= game[field]) {
          // store the latest occurrence of the game log high
          maxes[j - 3].val = game[field];
          maxes[j - 3].row = i;
        };
        let formattedField = j < 3 ? game[field] : game[field] !== null ? game[field].toFixed(cellsToSkip.includes(field) ? 3 : 1) : '-'; // round percentages to 3 decimal places
        cells[j + 1] = (<Table.Cell className='player-game-log-stat' key={j + 1}>{formattedField}</Table.Cell>);
      });

      return (
        <Table.Row key={i} active={(i + 1) % 10 === 0}>{cells}</Table.Row>
      );
    });

    maxes.forEach((maxIndex, i) => { // rewrite cells to change className since className is read-only
      if (maxIndex.val === -Infinity) return;
      let isGood = i === maxes.length - 3 || i === maxes.length - 4 ? 'bad' : 'good';
      rows[maxIndex.row].props.children[i + 4] = (
        <Table.Cell className={`player-game-log-stat-${isGood}`} key={i + 4}>
          {maxIndex.val.toFixed(indexesToSkip.includes(i + 4) ? 3 : 1)}
        </Table.Cell>
      );
    });

    return (
      <div className='player-game-log-table-wrapper'>
        <h3 className='player-game-log-header'>Cumulative Season Average Game Log</h3>
        {this.addTable('player-game-log-table', headerCells, rows)}
      </div>
    );
  }
  renderGameLog() {
    let rows = [];
    this.props.playerGameLog.forEach((game, i) => {
      let cells = statsFields.map((field, j) => {
        let formattedStat = game[field];
        if (cellsToSkip.includes(j + 1)) formattedStat = !isNaN(game[field]) && game[field] !== null ? formattedStat.toFixed(3) : '-';
        else if (j > 3) formattedStat = !isNaN(game[field]) && game[field] !== null ? formattedStat : '-';
        return (
          <Table.Cell key={field} className='player-game-log-stat'>{formattedStat}</Table.Cell>
        );
      });
      rows.push(
        <Table.Row key={`game-${i}`} active={(i + 1) % 10 === 0}>
          <Table.Cell className='player-game-log-stat'>{i + 1}</Table.Cell>
          {cells}
        </Table.Row>
      );
    });
    return (
      <div className='player-game-log-table-wrapper'>
        <h3 className='player-game-log-header'>Regular Season Game Log</h3>
        {this.addTable('player-game-log-table', headerCells, rows)}
      </div>
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
        render: () => (
          <Tab.Pane>
            {this.renderGameLog()}
          </Tab.Pane>
        )
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
