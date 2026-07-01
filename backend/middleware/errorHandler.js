function notFound(_req, res, next) {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.status || 500;

  res.status(statusCode).json({
    message: error.message || 'Server error'
  });
}

module.exports = { notFound, errorHandler };