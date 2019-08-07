const faker = require('faker');

const attraction = id => ({
  name: faker.company.companyName(),
  placeId: faker.random.uuid(),
  rating: faker.random.number(50) / 10,
  types: ['point_of_interest', 'establishment'],
  picture: faker.image.imageUrl(200, 300),
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
