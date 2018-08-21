import axios from 'axios';
const url = 'http://localhost:8080/';

const Sources = {
  getPlayers: year => {
    return axios.get(`${url}allPlayers?year=${year}`);
  }
};

export default Sources;
