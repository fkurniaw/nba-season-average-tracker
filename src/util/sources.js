import axios from 'axios';
const url = 'http://localhost:8080/';

const Sources = {
  getPlayers: year => {
    return axios.get(`${url}allPlayers?year=${year}`);
  },

  getPlayer: id => {
    return axios.get(`${url}player?playerId=${id}`);
  }
};

export default Sources;
