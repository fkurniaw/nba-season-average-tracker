import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';

import './playerStats.css';
import { Link } from 'react-router-dom';
import { Loader, Table } from 'semantic-ui-react';

const headers = ['Year', 'Team', 'GP', 'GS', 'MPG', 'FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%',
  'FTM', 'FTA', 'FT%', 'ORPG', 'DRPG', 'RPG', 'APG', 'SPG', 'BPG', 'TOV', 'PF', 'PPG'];

const fields = ['team_abbreviation', 'gp', 'gs', 'min', 'fgm', 'fga', 'fg_pct', 'fg3m', 'fg3a', 'fg3_pct',
  'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'tov', 'pf', 'pts'];

const nonRoundedFields = ['team_abbreviation', 'gp', 'gs'];

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
  addMainStats(stat, i, maxes) {
    let cells = [];
    fields.forEach((field, j) => {
      let fieldString;
      if (nonRoundedFields.includes(field)) fieldString = typeof (stat[field]) === 'number' || typeof (stat[field]) === 'string' ? stat[field] : '-';
      else fieldString = typeof (stat[field]) === 'number' ? stat[field].toFixed(field.indexOf('_pct') > -1 ? 3 : 1) : '-';
      if (typeof (stat[field]) === 'number' && typeof (i) === 'number' && j > 0 && stat[field] > 0) {
        if (maxes[j - 1].vals.some(val => stat[field] > val)) {
          maxes[j - 1].vals = [fieldString];
          maxes[j - 1].rows = [i];
        } else if (maxes[j - 1].vals.some(val => stat[field] === val)) {
          // keep track of multiple occurrences of career highs
          maxes[j - 1].vals.push(fieldString);
          maxes[j - 1].rows.push(i);
        }
      }
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
    let maxes = [];
    for (let i = 0; i < fields.length - 1; i++) maxes.push({ vals: [-Infinity], rows: [0] });
    let headerCells = headers.map(header => {
      return (
        <Table.HeaderCell key={header} className='player-stats-table-header'>
          {header}
        </Table.HeaderCell>
      );
    });
    this.props.currentPlayer.regularSeasonAvg.forEach((season, i) => {
      rows.push(this.addMainStats(season, i, maxes));
    });
    maxes.forEach((field, i) => {
      if (field.vals.includes(-Infinity)) return;
      field.rows.forEach(rowIndex => {
        rows[rowIndex].props.children[1][i + 1] = (<Table.Cell key={i + 1} className='season-stat-high'>
          {field.vals[0]}
        </Table.Cell>);
      });
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
        </Table.Body>
        <Table.Footer className='player-stats-table-footer'>
          {this.addMainStats(this.props.currentPlayer.careerTotalsRegular[0], 'career')}
        </Table.Footer>
      </Table>
    );
  }
  render() {
    return (
      <div className='player-stats-table'>
        {Object.keys(this.props.currentPlayer).length > 0 ? this.renderTable() : <Loader active />}
      </div>
    );
  }
}

PlayerStats.propTypes = {
  currentPlayer: PropTypes.object,
  match: PropTypes.object,
  setCurrentPlayer: PropTypes.func,
  setPlayerGameLog: PropTypes.func,
  setPlayerId: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {
    currentPlayer: state.players.currentPlayer,
    id: ownProps.id
  };
};

const actionCreators = {
  setCurrentPlayer: actions.setCurrentPlayer,
  setPlayerGameLog: actions.setPlayerGameLog,
  setPlayerId: actions.setPlayerId
};

export default connect(mapStateToProps, actionCreators)(PlayerStats);
