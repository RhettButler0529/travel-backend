const faker = require('faker');

const attraction = id => ({
  id,
  placeId: faker.random.uuid(),
  name: faker.company.companyName(),
  description: faker.company.catchPhraseDescriptor,
  lat: faker.address.latitude(),
  lng: faker.address.longitude(),
  address: faker.address.streetAddress(),
  phone: faker.phone.phoneNumber(),
  rating: faker.random.number(3),
  numRatings: faker.random.number(10000),
});

const generateAttractionDb = (num) => {
  const attractionDb = [];
  for (let i = 0; i < num; i += 1) {
    attractionDb.push(attraction(i));
  }

  return attractionDb;
};

module.exports = generateAttractionDb;
