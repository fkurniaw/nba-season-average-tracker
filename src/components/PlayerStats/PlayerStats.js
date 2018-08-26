import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../util/sources';
import * as actions from './playerStatsActionCreators';

import './playerStats.css';
import { Table } from 'semantic-ui-react';

const headers = ['Year', 'Team', 'GP', 'GS', 'MPG', 'FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%',
  'FTM', 'FTA', 'FT%', 'ORPG', 'DRPG', 'RPG', 'APG', 'SPG', 'BPG', 'TOV', 'PF', 'PPG'];

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
        <Table.Row key={`${season.season_id} i`}>
          <Table.Cell>{season.season_id || '-'}</Table.Cell>
          <Table.Cell>{season.team_abbreviation || '-'}</Table.Cell>
          <Table.Cell>{season.gp || '-'}</Table.Cell>
          <Table.Cell>{season.gs || '-'}</Table.Cell>
          <Table.Cell>{season.min || '-'}</Table.Cell>
          <Table.Cell>{season.fgm || '-'}</Table.Cell>
          <Table.Cell>{season.fga || '-'}</Table.Cell>
          <Table.Cell>{season.fg_pct || '-'}</Table.Cell>
          <Table.Cell>{season.fg3m || '-'}</Table.Cell>
          <Table.Cell>{season.fg3a || '-'}</Table.Cell>
          <Table.Cell>{season.fg3_pct || '-'}</Table.Cell>
          <Table.Cell>{season.ftm || '-'}</Table.Cell>
          <Table.Cell>{season.fta || '-'}</Table.Cell>
          <Table.Cell>{season.ft_pct || '-'}</Table.Cell>
          <Table.Cell>{season.oreb || '-'}</Table.Cell>
          <Table.Cell>{season.dreb || '-'}</Table.Cell>
          <Table.Cell>{season.reb || '-'}</Table.Cell>
          <Table.Cell>{season.ast || '-'}</Table.Cell>
          <Table.Cell>{season.stl}</Table.Cell>
          <Table.Cell>{season.blk || '-'}</Table.Cell>
          <Table.Cell>{season.tov || '-'}</Table.Cell>
          <Table.Cell>{season.pf || '-'}</Table.Cell>
          <Table.Cell>{season.pts || '-'}</Table.Cell>
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
        {Object.keys(this.props.currentPlayer).length > 0 && this.renderTable()}
      </div>
    );
  }
}

PlayerStats.propTypes = {
  currentPlayer: PropTypes.object,
  match: PropTypes.object,
  setCurrentPlayer: PropTypes.func
};

const mapStateToProps = state => {
  return {
    currentPlayer: state.players.currentPlayer
  };
};

const actionCreators = {
  setCurrentPlayer: actions.setCurrentPlayer
};

export default connect(mapStateToProps, actionCreators)(PlayerStats);
