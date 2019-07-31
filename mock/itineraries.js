const faker = require('faker');
const attractions = require('./attractions');

const itinerary = (id, numAttractions) => ({
  id,
  attractions: attractions(numAttractions),
});

const generateItineraryDb = () => {
  const itineraryDb = [];
  for (let i = 0; i < faker.random.number(3); i += 1) {
    itineraryDb.push(itinerary(i + 1, faker.random.number(5)));
  }

  return itineraryDb;
};

module.exports = generateItineraryDb;
