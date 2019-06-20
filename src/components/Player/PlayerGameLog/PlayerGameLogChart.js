import React from 'react';
import PropTypes from 'prop-types';

import Chart from 'react-google-charts';
import { Loader } from 'semantic-ui-react';

const title = {
    playerGameLog: 'Season Game Log Progression',
    playerCumulativeAverageGameLog: 'Season Average Progression',
    playerCumulativeTotalGameLog: 'Season Totals Progression',
};

const PlayerGameLogChart = props => {
    return (
        <Chart
            data={props.data}
            chartType="LineChart"
            loading={<Loader active />}
            width="100%"
            height="300px"
            options={{
                hAxis: {
                    title: 'Games Played',
                    titleTextStyle: {
                        color: '#000000',
                    },
                },
                vAxis: {
                    title: props.chartType,
                    titleTextStyle: {
                        color: '#000000',
                    },
                },
                title: title[props.gameLogType],
                curveType:
                    props.gameLogType === 'playerCumulativeAverageGameLog'
                        ? 'function'
                        : 'none',
                legend: { position: 'bottom' },
            }}
        />
    );
};

PlayerGameLogChart.propTypes = {
    chartType: PropTypes.string,
    gameLogType: PropTypes.string,
    data: PropTypes.array,
};

export default PlayerGameLogChart;
