import axios from 'axios';
const url = process.env.SERVER_URL;

const Sources = {
  getPlayers: year => {
    return axios.get(`${url}allPlayers?year=${year}`);
  },

  getPlayer: id => {
    return axios.get(`${url}getPlayerStats?playerId=${id}`);
  },

  getPlayerBio: id => {
    return axios.get(`${url}getPlayerBio?playerId=${id}`);
  },

  getGameLog: (id, season, seasonType) => {
    return axios.get(`${url}getPlayerGameLog?playerId=${id}&season=${season}&seasonType=${seasonType}`);
  }
};

export default Sources;
