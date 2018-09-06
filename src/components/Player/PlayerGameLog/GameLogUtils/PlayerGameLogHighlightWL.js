import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../../redux/actionCreators/playersActions';

import { Checkbox } from 'semantic-ui-react';

const PlayerGameLogHighlightWL = props => {
  return (
    <Checkbox label='Highlight Win/Loss'
      className='player-game-log-highlight-wl'
      defaultChecked={props.highlightWL}
      onClick={() => props.setHighlightWL(!props.highlightWL)}/>
  );
};

const mapStateToProps = state => {
  return {
    highlightWL: state.players.highlightWL
  };
};

const actionCreators = {
  setHighlightWL: actions.setHighlightWL
};

PlayerGameLogHighlightWL.propTypes = {
  highlightWL: PropTypes.bool,
  setHighlightWL: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(PlayerGameLogHighlightWL);
