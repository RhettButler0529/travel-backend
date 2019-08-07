const express = require('express');
const mock = require('../../middleware/mock');
const cityData = require('../../../mock/dev/city');

const router = express.Router();

router.get('/details/:city', mock(cityData), async (req, res) => {
  const { params } = req;
  res.json({
    status: 'success',
    city: params.city,
    message: 'nou',
  });
});

module.exports = router;
