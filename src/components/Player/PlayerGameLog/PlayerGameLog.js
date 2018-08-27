import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';

import './playerGameLog.css';
import { Table } from 'semantic-ui-react';

const headers = ['Game', 'Date', 'Matchup', 'W/L', 'Min', 'FGM', 'FGA', 'FG%',
  '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'OREB', 'DREB', 'AST', 'STL', 'BLK', 'PF', 'TOV', '+/-', 'PTS'];

class PlayerGameLog extends React.Component {
  constructor() {
    super();
    this.state = {};
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
  renderCumulativeAverages() {
    const rowsToSkip = [7, 10, 13, 21];
    let headerCells = headers.map(stat => {
      return (
        <Table.HeaderCell key={stat} className='player-game-log-cell-headers'>
          {stat}
        </Table.HeaderCell>
      );
    });
    let averages = new Array(23).fill(0, 0, 23);

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
      averages[16] += game.ast;
      averages[17] += game.stl;
      averages[18] += game.blk;
      averages[19] += game.pf;
      averages[20] += game.tov;
      averages[21] += game.plus_minus;
      averages[22] += game.pts;
      let cells = averages.map((stat, j) => (
        <Table.Cell className='player-game-log-stat' key={j}>
          {j < 4 || rowsToSkip.includes(j) ? stat : Math.round((stat / (i + 1)) * 10) / 10}
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
      rows.push(
        <Table.Row key={`game-${i}`}>
          <Table.Cell className='player-game-log-stat'>{i + 1}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.game_date}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.matchup}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.wl}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.min}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.fgm}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.fga}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.fg_pct}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.fg3m}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.fg3a}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.fg3_pct}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.ftm}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.fta}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.ft_pct}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.oreb}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.dreb}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.ast}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.stl}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.blk}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.pf}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.tov}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.plus_minus}</Table.Cell>
          <Table.Cell className='player-game-log-stat'>{game.pts}</Table.Cell>
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
  render() {
    return (
      <div className='player-game-log'>
        <h1>{this.props.playerName}</h1>
        {this.props.playerGameLog.length > 0 && this.renderGameLog()}
        {this.props.playerGameLog.length > 0 && this.renderCumulativeAverages()}
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
