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
        <Table.HeaderCell key={stat} className='player-gamelog-headers'>
          {stat}
        </Table.HeaderCell>
      );
    });

    this.props.playerGameLog.forEach((game, i) => {
      rows.push(
        <Table.Row key={`game-${i}`}>
          <Table.Cell>{i}</Table.Cell>
          <Table.Cell>{game.game_date}</Table.Cell>
          <Table.Cell>{game.matchup}</Table.Cell>
          <Table.Cell>{game.wl}</Table.Cell>
          <Table.Cell>{game.min}</Table.Cell>
          <Table.Cell>{game.fgm}</Table.Cell>
          <Table.Cell>{game.fga}</Table.Cell>
          <Table.Cell>{game.fg_pct}</Table.Cell>
          <Table.Cell>{game.fg3a}</Table.Cell>
          <Table.Cell>{game.fg3m}</Table.Cell>
          <Table.Cell>{game.fg3_pct}</Table.Cell>
          <Table.Cell>{game.ftm}</Table.Cell>
          <Table.Cell>{game.fta}</Table.Cell>
          <Table.Cell>{game.ft_pct}</Table.Cell>
          <Table.Cell>{game.oreb}</Table.Cell>
          <Table.Cell>{game.dreb}</Table.Cell>
          <Table.Cell>{game.ast}</Table.Cell>
          <Table.Cell>{game.stl}</Table.Cell>
          <Table.Cell>{game.blk}</Table.Cell>
          <Table.Cell>{game.pf}</Table.Cell>
          <Table.Cell>{game.tov}</Table.Cell>
          <Table.Cell>{game.plus_minus}</Table.Cell>
          <Table.Cell>{game.pts}</Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Table className='player-gamelog-table' collapsing stackable>
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
        {this.renderGameLog()}
      </div>
    );
  }
}

PlayerGameLog.propTypes = {
  match: PropTypes.object,
  playerGameLog: PropTypes.array,
  setPlayerGameLog: PropTypes.func
};

const mapStateToProps = state => {
  return {
    playerGameLog: state.players.playerGameLog
  };
};

const actionCreators = { ...actions };

export default connect(mapStateToProps, actionCreators)(PlayerGameLog);
