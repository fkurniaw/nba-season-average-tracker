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
  return (
    <Table.HeaderCell key={stat}
      className='player-game-log-cell-headers'>{stat}</Table.HeaderCell>
  );
});

const statsFields = ['game_date', 'matchup', 'wl', 'min', 'fgm', 'fga', 'fg_pct',
  'fg3m', 'fg3a', 'fg3_pct', 'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'pf', 'tov', 'plus_minus', 'pts'];

const cellsToSkip = [7, 10, 13];

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
      res.data.PlayerGameLog.reverse();
      this.props.setPlayerGameLog(res.data.PlayerGameLog);
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
        case 'defense':
          totals[0] += game.blk;
          totals[1] += game.stl;
          totals[2] += game.pf;
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
    let averages = new Array(headerCells.length).fill(0, 0, headerCells.length); // running total for each stat
    let maxes = []; // style cells with max values
    for (let i = 0; i < headerCells.length - 4; i++) maxes.push({ val: -Infinity, row: 0 });
    let rows = this.props.playerGameLog.map((game, i) => {
      averages[0] = i + 1;
      statsFields.forEach((field, j) => {
        if (j + 1 < 4) averages[j + 1] = game[field];
        else if (cellsToSkip.includes(j + 1)) averages[j + 1] = averages[j] === 0 ? 0 : Math.round((averages[j - 1] / averages[j]) * 1000) / 1000;
        else averages[j + 1] += game[field];
      });
      let cells = averages.map((stat, j) => {
        // store max val for each cell after 10 games; skip the first 4 columns (game number, date, matchup, W/L)
        if (j > 3 && this.props.playerGameLog.length > MIN_GAMES && i >= MIN_INDEX) {
          if (cellsToSkip.includes(j) && maxes[j - 4].val < stat) {
            maxes[j - 4].val = stat;
            maxes[j - 4].row = i;
          } else if (!cellsToSkip.includes(j) && maxes[j - 4].val < stat / (i + 1)) {
            maxes[j - 4].val = stat / (i + 1);
            maxes[j - 4].row = i;
          }
        };

        let formattedStat;
        if (j < 4) formattedStat = stat;
        else if (cellsToSkip.includes(j)) formattedStat = !isNaN(stat) ? stat.toFixed(3) : '-';
        else formattedStat = !isNaN(stat) ? (stat / (i + 1)).toFixed(1) : '-';
        return (<Table.Cell className='player-game-log-stat' key={j}>{formattedStat}</Table.Cell>);
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
          {maxIndex.val.toFixed(cellsToSkip.includes(i + 4) ? 3 : 1)}
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
        if (cellsToSkip.includes(j + 1)) formattedStat = !isNaN(game[field]) ? formattedStat.toFixed(3) : '-';
        else if (j > 3) formattedStat = !isNaN(game[field]) ? formattedStat : '-';
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
  playerGameLog: PropTypes.array,
  playerName: PropTypes.string,
  setPlayerGameLog: PropTypes.func,
  setPlayerId: PropTypes.func
};

const mapStateToProps = state => {
  return {
    playerGameLog: state.players.playerGameLog || [],
    playerName: state.players.playerName
  };
};

const actionCreators = { ...actions };

export default connect(mapStateToProps, actionCreators)(PlayerGameLog);
