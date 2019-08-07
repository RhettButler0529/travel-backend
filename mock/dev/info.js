const faker = require('faker');

const info = () => faker.lorem.sentences(4);

const infoData = {
  status: 'success',
  description: info(),
};

module.exports = infoData;
