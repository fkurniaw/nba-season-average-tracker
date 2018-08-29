import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';

import './playerStats.css';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

const headers = ['Year', 'Team', 'GP', 'GS', 'MPG', 'FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%',
  'FTM', 'FTA', 'FT%', 'ORPG', 'DRPG', 'RPG', 'APG', 'SPG', 'BPG', 'TOV', 'PF', 'PPG'];

const fields = ['team_abbreviation', 'gp', 'gs', 'min', 'fgm', 'fga', 'fg_pct', 'fg3m', 'fg3a', 'fg3_pct',
  'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'tov', 'pf', 'pts'];

const nonRoundedFields = ['team_abbreviation', 'gp', 'gs'];

function filter(num, decimalPlaces) {
  return typeof (num) === 'number' ? (Math.round(num * decimalPlaces) / decimalPlaces).toFixed(1) : '-';
}

class PlayerStats extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this.props.setPlayerId(this.props.match.params.id);
    Sources.getPlayer(this.props.match.params.id).then(res => {
      this.props.setCurrentPlayer(res.data);
    }).catch(err => {
      console.info(err);
    });
  }
  addMainStats(stat, i) {
    let cells = [];
    fields.forEach(field => {
      let fieldString;
      if (nonRoundedFields.includes(field)) fieldString = stat[field] || '-';
      else if (field.indexOf('_pct') > -1) fieldString = typeof (stat[field]) === 'number' ? stat[field].toFixed(3) : '-';
      else fieldString = typeof (stat[field]) === 'number' ? filter(stat[field], 10) : '-';
      cells.push(
        <Table.Cell
          key={field}
          className={i === 'career' ? 'career-stat' : 'season-stat'}>
          {fieldString}
        </Table.Cell>
      );
    });
    return (
      <Table.Row key={`${stat.season_id} ${i}`}>
        <Table.Cell className={i === 'career' ? 'career-stat' : 'season-stat'}>
          {i === 'career' ? 'Career'
            : <Link to={`/players/${this.props.match.params.id}/gamelog/${stat.season_id}`} onClick={() => this.props.setPlayerGameLog([])}>
              {stat.season_id}
            </Link> || '-'}
        </Table.Cell>
        {cells}
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
        {Object.keys(this.props.currentPlayer).length > 0 && this.renderTable()}
      </div>
    );
  }
}

PlayerStats.propTypes = {
  currentPlayer: PropTypes.object,
  match: PropTypes.object,
  playerName: PropTypes.string,
  setCurrentPlayer: PropTypes.func,
  setPlayerGameLog: PropTypes.func,
  setPlayerId: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {
    currentPlayer: state.players.currentPlayer,
    playerName: state.players.playerName
  };
};

const actionCreators = {
  setCurrentPlayer: actions.setCurrentPlayer,
  setPlayerGameLog: actions.setPlayerGameLog,
  setPlayerId: actions.setPlayerId
};

export default connect(mapStateToProps, actionCreators)(PlayerStats);
