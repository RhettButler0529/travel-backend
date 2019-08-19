const local = require('jwt-decode');
const axios = require('axios');

const remote = async (token) => {
  const { data } = await axios.get(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
  );
  return data;
};

module.exports = {
  local,
  remote,
};
