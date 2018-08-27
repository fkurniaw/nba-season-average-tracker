import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';

import './playerGameLog.css';
import { Menu, Tab, Table } from 'semantic-ui-react';
import PlayerGameLogChart from './PlayerGameLogChart';

const headers = ['Game', 'Date', 'Matchup', 'W/L', 'Min', 'FGM', 'FGA', 'FG%',
  '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'PF', 'TOV', '+/-', 'PTS'];

const statsFields = ['game_date', 'matchup', 'wl', 'min', 'fgm', 'fga', 'fg_pct',
  'fg3m', 'fg3a', 'fg3_pct', 'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'pf', 'tov', 'plus_minus', 'pts'];

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
    const rowsToSkip = [7, 10, 13, 21];
    let headerCells = headers.map(stat => {
      return (
        <Table.HeaderCell key={stat} className='player-game-log-cell-headers'>
          {stat}
        </Table.HeaderCell>
      );
    });
    let averages = new Array(headers.length).fill(0, 0, headers.length);

    let rows = this.props.playerGameLog.map((game, i) => {
      averages[0] = i + 1;
      averages[1] = game.game_date;
      averages[2] = game.matchup;
      averages[3] = game.wl;
      averages[4] += game.min;
      averages[5] += game.fgm;
      averages[6] += game.fga;
      averages[7] = averages[6] === 0 ? 0 : Math.round((averages[5] / averages[6]) * 1000) / 1000;
      averages[8] += game.fg3m;
      averages[9] += game.fg3a;
      averages[10] = averages[9] === 0 ? 0 : Math.round((averages[8] / averages[9]) * 1000) / 1000;
      averages[11] += game.ftm;
      averages[12] += game.fta;
      averages[13] = averages[12] === 0 ? 0 : Math.round((averages[11] / averages[12]) * 1000) / 1000;
      averages[14] += game.oreb;
      averages[15] += game.dreb;
      averages[16] += game.reb;
      averages[17] += game.ast;
      averages[18] += game.stl;
      averages[19] += game.blk;
      averages[20] += game.pf;
      averages[21] += game.tov;
      averages[22] += game.plus_minus;
      averages[23] += game.pts;
      let cells = averages.map((stat, j) => (
        <Table.Cell className='player-game-log-stat' key={j}>
          {j < 4 || rowsToSkip.includes(j) ? stat || '-' : Math.round((stat / (i + 1)) * 10) / 10}
        </Table.Cell>
      ));
      return (
        <Table.Row key={i}>
          {cells}
        </Table.Row>
      );
    });

    return (
      <div className='player-game-log-table-wrapper'>
        <h3 className='player-game-log-header'>Cumulative Season Average Game Log</h3>
        <Table className='player-game-log-table'>
          <Table.Header>
            <Table.Row>
              {headerCells}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
      </div>
    );
  }
  renderGameLog() {
    let rows = [];
    let headerCells = headers.map(stat => {
      return (
        <Table.HeaderCell key={stat} className='player-game-log-cell-headers'>
          {stat}
        </Table.HeaderCell>
      );
    });
    this.props.playerGameLog.forEach((game, i) => {
      let cells = statsFields.map(field => {
        return (
          <Table.Cell key={field} className='player-game-log-stat'>{game[field]}</Table.Cell>
        );
      });
      rows.push(
        <Table.Row key={`game-${i}`}>
          <Table.Cell className='player-game-log-stat'>{i + 1}</Table.Cell>
          {cells}
        </Table.Row>
      );
    });
    return (
      <div className='player-game-log-table-wrapper'>
        <h3 className='player-game-log-header'>Regular Season Game Log</h3>
        <Table className='player-game-log-table' collapsing stackable>
          <Table.Header>
            <Table.Row>
              {headerCells}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
      </div>
    );
  }
  renderGameLogTabs() {
    let panes = [
      {
        menuItem:
          (<Menu.Item
            className='player-game-log-menu-item'
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
            onClick={() => this.setState({ gameLogTab: 1 })}>
            Cumulative Season Averages Game Log
          </Menu.Item>),
        render: () => (
          <Tab.Pane>
            {this.renderCumulativeAverages()}
          </Tab.Pane>
        )
      }
    ];
    return (
      <Tab
        menu={{
          color: 'blue',
          secondary: true,
          pointing: true
        }}
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
        {this.props.playerGameLog.length > 0 && this.renderCumulativeChart('counting')}
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
