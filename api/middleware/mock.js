const mock = data => async (req, res, next) => {
  try {
    if (req.headers.env !== 'production') {
      return res.json(data);
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Unknown Server Error',
    });
  }
};

module.exports = mock;
