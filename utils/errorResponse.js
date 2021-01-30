class ErrorResponse extends Error {
    constructor(message, data, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.data = data
    }
  }
  
  module.exports = ErrorResponse;