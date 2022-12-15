module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong MongoDb Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    return res.status(400).json({
      succuss: false,
      message: message,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    return res.status(400).json({
      succuss: false,
      message: message,
    });
  }

  // Wrong JWT Error
  if (err.name === "jsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    return res.status(400).json({
      succuss: false,
      message: message,
    });
  }

  // JWT Expire Error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, try again`;
    return res.status(400).json({
      succuss: false,
      message: message,
    });
  }

  // Default Error
  res.status(err.statusCode).json({
    succuss: false,
    message: err.message,
  });
};
