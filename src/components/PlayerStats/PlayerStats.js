import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../util/sources';
import * as actions from './playerStatsActionCreators';

import './playerStats.css';
import { Table } from 'semantic-ui-react';

const headers = ['Year', 'Team', 'GP', 'GS', 'MPG', 'FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%',
  'FTM', 'FTA', 'FT%', 'ORPG', 'DRPG', 'RPG', 'APG', 'SPG', 'BPG', 'TOV', 'PF', 'PPG'];

function filter(num, decimalPlaces) {
  return typeof (num) === 'number' ? Math.round(num * decimalPlaces) / decimalPlaces : '-';
}

class PlayerStats extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    Sources.getPlayer(this.props.match.params.id).then(res => {
      console.info(res.data);
      this.props.setCurrentPlayer(res.data);
    }).catch(err => {
      console.info(err);
    });
  }
  renderTable() {
    let rows = [];
    let headerCells = headers.map(header => {
      return (
        <Table.HeaderCell key={header}>
          {header}
        </Table.HeaderCell>
      );
    });
    this.props.currentPlayer.regularSeasonAvg.forEach((season, i) => {
      rows.push(
        <Table.Row key={`${season.season_id} ${i}`}>
          <Table.Cell>{season.season_id || '-'}</Table.Cell>
          <Table.Cell>{season.team_abbreviation || '-'}</Table.Cell>
          <Table.Cell>{season.gp || '-'}</Table.Cell>
          <Table.Cell>{season.gs || '-'}</Table.Cell>
          <Table.Cell>{filter(season.min, 10)}</Table.Cell>
          <Table.Cell>{filter(season.fgm, 10)}</Table.Cell>
          <Table.Cell>{filter(season.fga, 10)}</Table.Cell>
          <Table.Cell>{season.fg_pct || '-'}</Table.Cell>
          <Table.Cell>{filter(season.fg3m, 10)}</Table.Cell>
          <Table.Cell>{filter(season.fg3a, 10)}</Table.Cell>
          <Table.Cell>{season.fg3_pct || '-'}</Table.Cell>
          <Table.Cell>{filter(season.ftm, 10)}</Table.Cell>
          <Table.Cell>{filter(season.fta, 10)}</Table.Cell>
          <Table.Cell>{season.ft_pct || '-'}</Table.Cell>
          <Table.Cell>{filter(season.oreb, 10)}</Table.Cell>
          <Table.Cell>{filter(season.dreb, 10)}</Table.Cell>
          <Table.Cell>{filter(season.reb, 10)}</Table.Cell>
          <Table.Cell>{filter(season.ast, 10)}</Table.Cell>
          <Table.Cell>{filter(season.stl, 10)}</Table.Cell>
          <Table.Cell>{filter(season.blk, 10)}</Table.Cell>
          <Table.Cell>{filter(season.tov, 10)}</Table.Cell>
          <Table.Cell>{filter(season.pf, 10)}</Table.Cell>
          <Table.Cell>{filter(season.pts, 10)}</Table.Cell>
        </ Table.Row>
      );
    });
    return (
      <Table className='player-table-stats'>
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
      <div className='player-stats-table'>
        <h1>{this.props.playerName}</h1>
        {Object.keys(this.props.currentPlayer).length > 0 && this.renderTable()}
      </div>
    );
  }
}

PlayerStats.propTypes = {
  currentPlayer: PropTypes.object,
  match: PropTypes.object,
  playerName: PropTypes.string,
  setCurrentPlayer: PropTypes.func
};

const mapStateToProps = state => {
  return {
    currentPlayer: state.players.currentPlayer,
    playerName: state.players.playerName
  };
};

const actionCreators = {
  setCurrentPlayer: actions.setCurrentPlayer
};

export default connect(mapStateToProps, actionCreators)(PlayerStats);
