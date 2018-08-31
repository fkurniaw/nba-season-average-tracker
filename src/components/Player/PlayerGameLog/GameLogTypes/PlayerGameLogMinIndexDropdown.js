import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../../redux/actionCreators/playersActions';

import { Dropdown } from 'semantic-ui-react';

const PlayerGameLogMinGamesDropdown = props => {
  return (
    <div className='player-game-log-min-index-dropdown'>
      <h5 className='player-game-log-min-index-dropdown-header'>Highlight season highs after:</h5>
      <Dropdown selection
        defaultValue={props.minIndex}
        onChange={(e, data) => props.setMinIndex(data.value)}
        options={props.dropdownOptions} />
    </div>
  );
};

const mapStateToProps = state => {
  let dropdownOptions = [];
  for (let i = 1; i < state.players.playerGameLog.length; i++) {
    dropdownOptions.push({ key: i, value: i, text: `${i} game${i !== 1 ? 's' : ''}` });
  }
  return {
    dropdownOptions,
    minIndex: state.players.minIndex
  };
};

const actionCreators = {
  setMinIndex: actions.setMinIndex
};

PlayerGameLogMinGamesDropdown.propTypes = {
  dropdownOptions: PropTypes.array,
  minIndex: PropTypes.number,
  setMinIndex: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(PlayerGameLogMinGamesDropdown);
