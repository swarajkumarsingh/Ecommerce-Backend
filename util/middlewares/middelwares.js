const statusCode = require("../statusCode");

const errorResponseGenerator = (message, extra = {}) => {
  return {
    error: true,
    message: message || "Something went wrong",
    ...extra,
  };
};

const successResponseGenerator = (message, data, extra = {}) => {
  return {
    error: false,
    message: message || "Operation Successful",
    data: data || {},
    ...extra,
  };
};

const successResponse = function (message, data, extra = {}) {
  return this.status(statusCode.STATUS_OK).send(
    successResponseGenerator(message, data, extra)
  );
};

const errorResponse = function (stCode, message, extra = {}) {
  return this.status(stCode || statusCode.BAD_REQUEST).send(
    errorResponseGenerator(message, extra)
  );
};

const notFoundResponse = function (message, extra = {}) {
  return this.status(statusCode.NOT_FOUND).send(
    errorResponseGenerator(message, extra)
  );
};

const internalErrorResponse = function (message, extra = {}) {
  return this.status(statusCode.SOMETHING_WENT_WRONG).send(
    errorResponseGenerator(message, extra)
  );
};

module.exports = (express) => {
  return (_, __, next) => {
    express.response.successResponse = successResponse;
    express.response.errorResponse = errorResponse;
    express.response.notFoundResponse = notFoundResponse;
    express.response.internalErrorResponse = internalErrorResponse;
    next();
  };
};
