const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  const {rule, data} = req.body
  let error = { ...err };
  error.message = err.message;
  error.data = err.data

  if (!rule) {
    const message = `rule is required.`;
    const data = null
    error = new ErrorResponse(message, data, 400);
  }
  if (typeof rule != 'object') {
    const message = `rule should be an object.`;
    const data = null
    error = new ErrorResponse(message, data, 400);
  }
  if (!data) {
    const message = `data is required.`;
    const data = null
    error = new ErrorResponse(message, data, 400);
  }
  
  res
    .status(err.statusCode || error.statusCode || 500)
    .json({ message:error.message, status: "error", data: error.data });
    next()
}

module.exports = errorHandler;
