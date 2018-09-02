import React from 'react';
import PropTypes from 'prop-types';

import Chart from 'react-google-charts';
import { Loader } from 'semantic-ui-react';

const PlayerGameLogChart = props => {
  return (
    <Chart
      data={props.data}
      chartType='LineChart'
      loading={<Loader />}
      width='100%'
      height='300px'
      options={{
        hAxis: {
          title: 'Games Played',
          titleTextStyle: {
            color: '#000000'
          }
        },
        vAxis: {
          title: props.chartType,
          titleTextStyle: {
            color: '#000000'
          }
        },
        title: 'Season Average Progression',
        curveType: 'function',
        legend: { position: 'bottom' }
      }}/>
  );
};

PlayerGameLogChart.propTypes = {
  chartType: PropTypes.string,
  data: PropTypes.array,
  type: PropTypes.string
};

export default PlayerGameLogChart;
