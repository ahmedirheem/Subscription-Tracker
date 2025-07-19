class ApiError extends Error {
  constructor(statusCode, message, details = {}){
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError;