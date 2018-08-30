import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';

import './playerGameLog.css';
import { Dropdown, Menu, Tab, Table } from 'semantic-ui-react';
import PlayerGameLogChart from './PlayerGameLogChart';
import PlayerGameLogGeneric from './GameLogTypes/PlayerGameLogGeneric';
import PlayerGameLogCumulativeAverage from './GameLogTypes/PlayerGameLogCumulativeAverage';

const MIN_GAMES = 15;

const headerCells = ['Game', 'Date', 'Matchup', 'W/L', 'Min', 'FGM', 'FGA', 'FG%',
  '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'PF', 'TOV', '+/-', 'PTS'].map(stat => {
  return (<Table.HeaderCell key={stat}className='player-game-log-cell-headers'>{stat}</Table.HeaderCell>);
});

const statsFields = ['game_date', 'matchup', 'wl', 'min', 'fgm', 'fga', 'fg_pct',
  'fg3m', 'fg3a', 'fg3_pct', 'ftm', 'fta', 'ft_pct', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'pf', 'tov', 'plus_minus', 'pts'];

const cellsToSkip = ['fg_pct', 'fg3_pct', 'ft_pct']; // for game log array

class PlayerGameLog extends React.Component {
  constructor() {
    super();
    this.state = {
      gameLogTab: 0,
      loading: true,
      minIndex: 10
    };
  }
  componentDidMount() {
    this.props.setPlayerId(this.props.match.id);
    Sources.getGameLog(this.props.match.params.id, this.props.match.params.season).then(res => {
      this.props.setPlayerGameLog(res.data.PlayerGameLog);
      this.props.setPlayerCumulativeAverageGameLog(res.data.CumulativeAverageGameLog);
      this.props.setPlayerCumulativeTotalGameLog(res.data.CumulativeTotalGameLog);
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
          return [i + 1, totals[0] / (i + 1)];
        default:
          totals[0] += game.pts;
          return [i + 1, totals[0] / (i + 1)];
      }
    });
    return (
      <PlayerGameLogChart
        data={data}
        type={type} />
    );
  }
  renderCumulativeTotals(title) {
    return (
      <PlayerGameLogGeneric
        addTable={this.addTable.bind(this)}
        cellsToSkip={cellsToSkip}
        headerCells={headerCells}
        statsFields={statsFields}
        title={title}
        type='totals' />
    );
  }
  renderCumulativeAverages(title) {
    return (
      <PlayerGameLogCumulativeAverage
        addTable={this.addTable.bind(this)}
        cellsToSkip={cellsToSkip}
        headerCells={headerCells}
        minGames={MIN_GAMES}
        minIndex={this.state.minIndex - 1}
        statsFields={statsFields}
        title={title} />
    );
  }
  renderGameLog(title) {
    return (
      <PlayerGameLogGeneric
        addTable={this.addTable.bind(this)}
        cellsToSkip={cellsToSkip}
        headerCells={headerCells}
        statsFields={statsFields}
        title={title} />
    );
  }
  renderGameLogTabs() {
    let titles = ['Regular Season Game Log', 'Cumulative Season Averages Game Log',
      'Cumulative Season Totals Game Log'];
    let menuItems = titles.map((title, i) => {
      return (
        <Menu.Item
          className='player-game-log-menu-item'
          key={i}
          onClick={() => this.setState({ gameLogTab: i })}>
          {title}
        </Menu.Item>
      );
    });
    let panes = [
      {
        menuItem: menuItems[0],
        render: () => (<Tab.Pane>{this.renderGameLog(titles[0])}</Tab.Pane>)
      },
      {
        menuItem: menuItems[1],
        render: () => (
          <Tab.Pane>
            {this.props.playerGameLog.length > 0 && this.renderCumulativeChart('counting')}
            {this.props.playerGameLog.length > MIN_GAMES && <div className='player-game-log-dropdown-wrapper'>
              <h5 className='player-game-log-dropdown-header'>Highlight season highs after:</h5>
              <Dropdown selection
                defaultValue={this.state.minIndex}
                onChange={(e, data) => this.setState({ minIndex: data.value })}
                options={this.props.dropdownOptions}/>
            </div>}
            {this.renderCumulativeAverages(titles[1])}
          </Tab.Pane>
        )
      },
      {
        menuItem: menuItems[2],
        render: () => (
          <Tab.Pane>
            {this.props.playerGameLog.length > 0 && this.renderCumulativeChart('counting')}
            {this.renderCumulativeTotals(titles[2])}
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
        {this.props.playerGameLog.length > 0 && this.renderGameLogTabs()}
      </div>
    );
  }
}

PlayerGameLog.propTypes = {
  dropdownOptions: PropTypes.array,
  match: PropTypes.object,
  playerGameLog: PropTypes.array,
  setPlayerCumulativeAverageGameLog: PropTypes.func,
  setPlayerCumulativeTotalGameLog: PropTypes.func,
  setPlayerGameLog: PropTypes.func,
  setPlayerId: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  let dropdownOptions = [];
  for (let i = 1; i < state.players.playerGameLog.length; i++) {
    dropdownOptions.push({ key: i, value: i, text: `${i} game${i !== 1 ? 's' : ''}` });
  }
  return {
    dropdownOptions,
    playerGameLog: state.players.playerGameLog || []
  };
};

const actionCreators = {
  setPlayerCumulativeAverageGameLog: actions.setPlayerCumulativeAverageGameLog,
  setPlayerCumulativeTotalGameLog: actions.setPlayerCumulativeTotalGameLog,
  setPlayerGameLog: actions.setPlayerGameLog,
  setPlayerId: actions.setPlayerId
};

export default connect(mapStateToProps, actionCreators)(PlayerGameLog);
