import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../redux/actionCreators/comparePlayersActions';
import { Search } from 'semantic-ui-react';

import './comparePlayers.css';

const MAX_RESULTS = 5;

function filterResults(players, currentInput, setPlayer, num) {
    let results = [];
    for (let i = 0; i < players.length; i++) {
        if (
            players[i].title.toLowerCase().indexOf(currentInput.toLowerCase()) >
            -1
        ) {
            results.push({
                className: 'player-search-result',
                title: players[i].title,
                id: players[i].id,
                renderer: function PlayerLink() {
                    return (
                        <Link
                            to={`/players/${players[i].id}`}
                            onClick={() =>
                                setPlayer(num, players[i].id, players[i].title)
                            }
                            className="player-search-link"
                        >
                            {players[i].title}
                        </Link>
                    );
                },
            });
        }
        if (results.length > MAX_RESULTS) break;
    }
    return results;
}

class ComparePlayers extends Component {
    constructor() {
        super();
        this.state = {
            inputOne: '',
            inputTwo: '',
        };
    }
    render() {
        return (
            <div className="compare-players">
                Player 1:{' '}
                {
                    <Search
                        className="compare-players-search"
                        onResultSelect={(e, data) =>
                            this.props.setPlayerId(data.result.id, 'One')
                        }
                        onSearchChange={e =>
                            this.setState({ inputOne: e.target.value })
                        }
                        results={filterResults(
                            this.props.players,
                            this.state.inputOne,
                            this.props.setPlayer,
                            1
                        )}
                    />
                }
                Player 2:{' '}
                {
                    <Search
                        className="compare-players-search"
                        onResultSelect={(e, data) =>
                            this.props.setPlayerId(data.result.id, 'Two')
                        }
                        onSearchChange={e =>
                            this.setState({ inputTwo: e.target.value })
                        }
                        results={filterResults(
                            this.props.players,
                            this.state.inputTwo,
                            this.setPlayer,
                            2
                        )}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        players: state.players.players,
    };
};

const actionCreators = {
    setPlayerOne: actions.setComparePlayer,
    setPlayerId: actions.setPlayerId,
};

ComparePlayers.propTypes = {
    players: PropTypes.array,
    setPlayer: PropTypes.func,
    setPlayerId: PropTypes.func,
};

export default connect(
    mapStateToProps,
    actionCreators
)(ComparePlayers);
