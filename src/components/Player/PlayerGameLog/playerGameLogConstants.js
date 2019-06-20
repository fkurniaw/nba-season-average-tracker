import React from 'react';
import { Table } from 'semantic-ui-react';

export const MIN_GAMES = 10;

export const headerCells = [
    'Game',
    'Date',
    'Matchup',
    'W/L',
    'Min',
    'FGM',
    'FGA',
    'FG%',
    '3PM',
    '3PA',
    '3P%',
    'FTM',
    'FTA',
    'FT%',
    'OREB',
    'DREB',
    'REB',
    'AST',
    'STL',
    'BLK',
    'PF',
    'TOV',
    '+/-',
    'PTS',
].map(stat => {
    return (
        <Table.HeaderCell key={stat} className="player-game-log-cell-headers">
            {stat}
        </Table.HeaderCell>
    );
});

export const statsFields = [
    'game_date',
    'matchup',
    'wl',
    'min',
    'fgm',
    'fga',
    'fg_pct',
    'fg3m',
    'fg3a',
    'fg3_pct',
    'ftm',
    'fta',
    'ft_pct',
    'oreb',
    'dreb',
    'reb',
    'ast',
    'stl',
    'blk',
    'pf',
    'tov',
    'plus_minus',
    'pts',
];

export const chartTypes = {
    Points: 'pts',
    Rebounds: 'reb',
    'Offensive Rebounds': 'oreb',
    'Defensive Rebounds': 'dreb',
    Assists: 'ast',
    Steals: 'stl',
    Blocks: 'blk',
    'Field Goals Made': 'fgm',
    'Field Goal Attempts': 'fga',
    'Field Goal Percentage': 'fg_pct',
    'Three Pointers Made': 'fg3m',
    'Three Pointer Attempts': 'fg3a',
    'Three Point Percentage': 'fg3_pct',
    'Free Throws Made': 'ftm',
    'Free Throw Attempts': 'fta',
    'Free Throw Percentage': 'ft_pct',
    'Plus/Minus': 'plus_minus',
    Turnovers: 'tov',
    'Personal Fouls': 'pf',
};

export const nonPerGameFields = [
    'Field Goal Percentage',
    'Three Point Percentage',
    'Free Throw Percentage',
    'Plus/Minus',
];

export const cellsToSkip = ['fg_pct', 'fg3_pct', 'ft_pct']; // for game log array
