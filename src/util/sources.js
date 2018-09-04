import axios from 'axios';
const url = process.env.SERVER_URL;

const Sources = {
  getPlayers: year => {
    return axios.get(`${url}allPlayers?year=${year}`);
  },

  getPlayer: id => {
    return axios.get(`${url}playerStats?playerId=${id}`);
  },

  getPlayerBio: id => {
    return axios.get(`${url}getPlayerBio?playerId=${id}`);
  },

  getGameLog: (id, season) => {
    return axios.get(`${url}getPlayerGameLog?playerId=${id}&season=${season}`);
  }
};

export default Sources;
