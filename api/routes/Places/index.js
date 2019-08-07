const express = require('express');
const axios = require('axios');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.PLACES_API_KEY,
  Promise,
});

const mock = require('../../middleware/mock');
const cityData = require('../../../mock/dev/city');
const infoData = require('../../../mock/dev/info');

const router = express.Router();

router.get('/details/:city', mock(cityData), async (req, res) => {
  try {
    const { params } = req;
    const { json: { candidates } } = await googleMapsClient.findPlace({
      input: params.city,
      inputtype: 'textquery',
      language: 'en',
      fields: ['geometry'],
    }).asPromise();

    // pulls the longitude/latitude off the first candidate in the response
    const { geometry: { location } } = candidates[0];

    const { json: { results } } = await googleMapsClient.places({
      query: 'stuff to do',
      location: Object.values(location),
      language: 'en',
    }).asPromise();

    const places = await Promise.all(results.filter(({ photos }) => photos).map(async ({
      name,
      place_id: placeId,
      price_level: price,
      photos,
      rating,
      types,
      user_ratings_total: totalRatings,
    }) => {
      let picture = '';

      const picRef = photos[0].photo_reference;
      const pictureReq = await googleMapsClient.placesPhoto({
        photoreference: picRef,
        maxwidth: 400,
      }).asPromise();

      picture = `https://${pictureReq.connection._host}${pictureReq.req.path}`; // eslint-disable-line

      return {
        name,
        placeId,
        price,
        rating,
        types,
        picture,
        totalRatings,
      };
    }));

    // parse data and cache to db if needed

    res.send({
      status: 'success',
      places: places.sort((a, b) => (b.rating - a.rating)),
    });
  } catch (error) {
    console.log(error); //eslint-disable-line
    res.send(error);
  }
});

router.get('/info/:attraction', mock(infoData), async (req, res) => {
  try {
    const { params } = req;
    const endpoint = 'https://kgsearch.googleapis.com/v1/entities:search';
    const { data: { itemListElement } } = await axios.get(endpoint, {
      params: {
        query: params.attraction,
        key: process.env.PLACES_API_KEY,
        limit: 1,
        indent: true,
        types: 'Place',
      },
    });
    const { result: { detailedDescription: { articleBody: description } } } = itemListElement[0];
    // console.log(info); // eslint-disable-line
    res.json({
      status: 'success',
      description,
    });
  } catch (error) {
    console.log(error); // eslint-disable-line
    res.status(500).json({
      status: 'error',
      message: 'Unknown server error',
    });
  }
});

module.exports = router;
