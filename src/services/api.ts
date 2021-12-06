import axios from 'axios';

const api = axios.create({
  baseURL: "https://roseestetica-api.herokuapp.com/"
});

export default api;