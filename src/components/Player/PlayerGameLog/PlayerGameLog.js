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
  renderGameLog() {
    let rows = [];
    let headerCells = headers.map(stat => {
      return (
        <Table.HeaderCell key={stat} className='player-game-log-headers'>
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
    );
  }
  render() {
    return (
      <div className='player-game-log'>
        <h1>{this.props.playerName}</h1>
        {this.props.playerGameLog.length > 0 && this.renderGameLog()}
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
