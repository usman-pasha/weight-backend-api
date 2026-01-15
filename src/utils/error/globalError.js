// Custom Imports
import responser from "../responser.js";
import logger from "../logger.js";

const sendError = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return responser.send(
      err.statusCode,
      err.handler,
      err.messageCode,
      req,
      res,
      err
    );
  } else {
    // 1) Log error
    logger.error("ERROR 💥", err);
    logger.error("ERROR StatusCode:" + err.statusCode);
    // 2) Send generic message
    return responser.send(500, "global", "G_E001", req,res,err);
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  sendError(err, req, res);
};

export default globalErrorHandler;
