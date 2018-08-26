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
  addMainStats(stat, i) {
    return (
      <Table.Row key={`${stat.season_id} ${i}`}>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{i === 'career' ? 'Career' : stat.season_id || '-'}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{stat.team_abbreviation || '-'}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{stat.gp || '-'}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{stat.gs || '-'}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.min, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.fgm, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.fga, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{stat.fg_pct || '-'}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.fg3m, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.fg3a, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{stat.fg3_pct || '-'}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.ftm, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.fta, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{stat.ft_pct || '-'}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.oreb, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.dreb, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.reb, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.ast, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.stl, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.blk, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.tov, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.pf, 10)}</Table.Cell>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>{filter(stat.pts, 10)}</Table.Cell>
      </ Table.Row>
    );
  }
  renderTable() {
    let rows = [];
    let headerCells = headers.map(header => {
      return (
        <Table.HeaderCell key={header} className='player-stats-table-header'>
          {header}
        </Table.HeaderCell>
      );
    });
    this.props.currentPlayer.regularSeasonAvg.forEach((season, i) => {
      rows.push(this.addMainStats(season, i));
    });
    return (
      <Table className='player-table-stats' collapsing stackable>
        <Table.Header className='player-stats-table-header'>
          <Table.Row>
            {headerCells}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows}
          {this.addMainStats(this.props.currentPlayer.careerTotalsRegular[0], 'career')}
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

const mapStateToProps = (state, ownProps) => {
  return {
    currentPlayer: state.players.currentPlayer,
    playerName: state.players.playerName
  };
};

const actionCreators = {
  setCurrentPlayer: actions.setCurrentPlayer
};

export default connect(mapStateToProps, actionCreators)(PlayerStats);
