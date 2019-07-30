const faker = require('faker');

const user = () => ({
  id: faker.random.uuid(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
});

const generateUserDb = (num) => {
  const userDb = [];
  for (let i = 0; i <= num; i += 1) {
    userDb.push(user());
  }

  return userDb;
};

module.exports = generateUserDb;
