const faker = require('faker');
const hash = require('../../utils/hash');

const attraction = id => ({
  name: faker.company.companyName(),
  placeId: faker.random.uuid(),
  rating: faker.random.number(50) / 10,
  price: faker.random.number(4),
  types: ['point_of_interest', 'establishment'],
  picture: 'https://fakeimg.pl/200x300',
  totalRatings: faker.random.number(10000),
});

const generateAttractions = () => {
  const attractions = [];
  for (let i = 0; i < 20; i += 1) {
    attractions.push(attraction(i));
  }

  return attractions;
};

const cityData = {
  status: 'success',
  places: generateAttractions(),
};

module.exports = cityData;
