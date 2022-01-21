const axios = require("axios");

const host = "http://localhost:6788/";

module.exports = {
  getUsers() {
    return axios.get(host + "api/users");
  },

  getUserById(id) {
    return axios.get(`${host}api/user/id?q=${id}`);
  },
};
