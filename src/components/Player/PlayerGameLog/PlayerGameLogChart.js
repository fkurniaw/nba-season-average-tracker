import React from 'react';
import PropTypes from 'prop-types';

import Chart from 'react-google-charts';
import { Loader } from 'semantic-ui-react';

const headersCounting = [['Game', 'Points']];
const headersPercentage = [['Game', 'FG%', '3P%', 'TS%']];
const headersDefense = [['Game', 'Steals', 'Blocks', 'Personal Fouls']];

const PlayerGameLogChart = props => {
  let data;
  if (props.type === 'counting') data = headersCounting.concat(props.data);
  if (props.type === 'percentage') data = headersPercentage.concat(props.data);
  if (props.type === 'defense') data = headersDefense.concat(props.data);

  return (
    <Chart
      data={data}
      chartType='LineChart'
      loading={<Loader />}
      width='100%'
      height='300px'
      options={{
        axes: {
          y: {
            Points: { label: 'Points per game' }
          },
          x: {
            title: 'Games'
          }
        },
        title: 'Season Average Progression',
        curveType: 'function',
        legend: { position: 'bottom' }
      }}/>
  );
};

PlayerGameLogChart.propTypes = {
  data: PropTypes.array,
  type: PropTypes.string
};

export default PlayerGameLogChart;
