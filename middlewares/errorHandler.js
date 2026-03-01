const errorHandler = (err, req, res, next) => {
  console.log(err.message, err.name);
  if (err.name === 'CastError') {
    return res.status(400).json({ err: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ err: err.message });
  }

  next(err);
};

module.exports = errorHandler;
