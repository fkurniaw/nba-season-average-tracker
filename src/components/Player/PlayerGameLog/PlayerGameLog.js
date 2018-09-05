import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sources from '../../../util/sources';
import * as actions from '../../../redux/actionCreators/playersActions';
import { MIN_GAMES, headerCells, statsFields, chartTypes, cellsToSkip, nonPerGameFields } from './playerGameLogConstants.js';

import './playerGameLog.css';
import { Dropdown, Menu, Loader, Tab, Table } from 'semantic-ui-react';
import PlayerGameLogChart from './PlayerGameLogChart';
import PlayerGameLogGeneric from './GameLogTypes/PlayerGameLogGeneric';
import PlayerGameLogCumulativeAverage from './GameLogTypes/PlayerGameLogCumulativeAverage';

class PlayerGameLog extends React.Component {
  constructor() {
    super();
    this.state = {
      chartType: 'Points',
      gameLogTab: 0,
      loading: true
    };
  }
  componentDidMount() {
    this.props.setPlayerId(this.props.match.id);
    Sources.getGameLog(this.props.match.params.id, this.props.match.params.season).then(res => {
      this.props.setPlayerGameLog(res.data.PlayerGameLog);
      this.props.setPlayerCumulativeAverageGameLog(res.data.CumulativeAverageGameLog);
      this.props.setPlayerCumulativeTotalGameLog(res.data.CumulativeTotalGameLog);
      this.props.setMissingFields(res.data.missingFields);
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
  renderGameLogChart(chartType, gameLogType) {
    const labelAffix = {
      'playerGameLog': '',
      'playerCumulativeAverageGameLog': ' Per Game',
      'playerCumulativeTotalGameLog': ' Total'
    };
    chartType += !nonPerGameFields.includes(chartType) ? labelAffix[gameLogType] : '';
    let data = [];
    let dropdownOptions = Object.keys(chartTypes).map(type => {
      return { key: chartTypes[type], value: type, text: type };
    });
    this.props[gameLogType].forEach((game, i) => {
      data.push([i + 1, game[chartTypes[this.state.chartType]]]);
    });
    dropdownOptions = Object.keys(this.props.missingFields).length > 0
      ? dropdownOptions.filter(option => !this.props.missingFields.missingFieldsGameLog[option.key]) : dropdownOptions;
    data.splice(0, 0, ['Game', chartType]);
    return (
      <div>
        <div className='chart-type-selector'>
          <h5 className='chart-type-selector-header'>Chart Type:</h5>
          <Dropdown selection
            defaultValue={this.state.chartType}
            options={dropdownOptions}
            onChange={(e, data) => this.setState({ chartType: data.value })}/>
        </div>
        <PlayerGameLogChart
          data={data}
          chartType={chartType}
          gameLogType={gameLogType} />
      </div>
    );
  }
  renderCumulativeTotals(title) {
    return (
      <PlayerGameLogGeneric
        addTable={this.addTable.bind(this)}
        cellsToSkip={cellsToSkip}
        headerCells={headerCells}
        minGames={MIN_GAMES}
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
        minGames={MIN_GAMES}
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
        render: () => (
          <Tab.Pane>
            {this.props.playerGameLog.length > 0 && this.renderGameLogChart(this.state.chartType, 'playerGameLog')}
            {this.renderGameLog(`${titles[0]} (${this.props.match.params.season})`)}
          </Tab.Pane>
        )
      },
      {
        menuItem: menuItems[1],
        render: () => (
          <Tab.Pane>
            {this.props.playerCumulativeAverageGameLog.length > 0 && this.renderGameLogChart(this.state.chartType, 'playerCumulativeAverageGameLog')}
            {this.renderCumulativeAverages(`${titles[1]} (${this.props.match.params.season})`)}
          </Tab.Pane>
        )
      },
      {
        menuItem: menuItems[2],
        render: () => (
          <Tab.Pane>
            {this.props.playerCumulativeTotalGameLog.length > 0 && Object.keys(this.props.missingFields).length > 0 &&
              this.renderGameLogChart(this.state.chartType, 'playerCumulativeTotalGameLog')}
            {this.renderCumulativeTotals(`${titles[2]} (${this.props.match.params.season})`)}
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
        {this.props.playerGameLog.length > 0 ? this.renderGameLogTabs() : <Loader active />}
      </div>
    );
  }
}

PlayerGameLog.propTypes = {
  match: PropTypes.object,
  missingFields: PropTypes.object,
  playerCumulativeAverageGameLog: PropTypes.array,
  playerCumulativeTotalGameLog: PropTypes.array,
  playerGameLog: PropTypes.array,
  setMissingFields: PropTypes.func,
  setPlayerCumulativeAverageGameLog: PropTypes.func,
  setPlayerCumulativeTotalGameLog: PropTypes.func,
  setPlayerGameLog: PropTypes.func,
  setPlayerId: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {
    missingFields: state.players.missingFields || {},
    playerGameLog: state.players.playerGameLog || [],
    playerCumulativeAverageGameLog: state.players.playerCumulativeAverageGameLog || [],
    playerCumulativeTotalGameLog: state.players.playerCumulativeTotalGameLog
  };
};

const actionCreators = {
  setMissingFields: actions.setMissingFields,
  setPlayerCumulativeAverageGameLog: actions.setPlayerCumulativeAverageGameLog,
  setPlayerCumulativeTotalGameLog: actions.setPlayerCumulativeTotalGameLog,
  setPlayerGameLog: actions.setPlayerGameLog,
  setPlayerId: actions.setPlayerId
};

export default connect(mapStateToProps, actionCreators)(PlayerGameLog);
