// Custom Imports
import messageCode from "../error-code/index.js";
import logger from "./log.js";

// Helper Functions
const isNumeric = (value) => {
  return /^-?\d+$/.test(value);
};

const getMessage = (handler, locale, code) => {
  return messageCode[handler][locale][code];
};

const isStatusCode = (statusCode) => {
  return isNumeric(statusCode) && statusCode >= 100 && statusCode < 600;
};

const successResponse = (handler, messageCode, req, data, success) => {
  let responseData = {
    status: "success",
    message: getMessage(handler, "en", messageCode),
    messageCode,
    success,
    data,
  };
  if (Array.isArray(data)) responseData.totals = { count: data.length };
  logger.info(`Success || ${messageCode} || ${handler} || ${req.originalUrl}`);
  return responseData;
};

const errorResponse = (handler, messageCode, req, error) => {
  let response = {
    status: "error",
    message: messageCode
      ? getMessage(handler, "en", messageCode)
      : "Unknown Error",
    messageCode,
  };

  if (!error?.isOperational) {
    // response.errorDetails = {
    //   message: error?.message,
    // };
    response.message = response.message + " : " + error.message;
  }

  if (error.isOperational) {
    if (error.mergeOptional) {
      response.message = response.message + " : " + error.optionalMessage;
    } else {
      response.errorDetails = error.optionalMessage;
    }
  }
  if (error.dynamicMessage) {
    response.message = error.dynamicMessage;
    response.errorDetails = error.data;
  }
  logger.data("Error", response);
  return response;
};


// Main function to send response
const send = (
  statusCode,
  handler,
  messageCode,
  req,
  res,
  data,
  success = true
) => {
  let responseData;
  statusCode = isStatusCode(statusCode) ? statusCode : 500;
  if (`${statusCode}`.startsWith("2"))
    responseData = successResponse(handler, messageCode, req, data, success);
  if (`${statusCode}`.startsWith("4") || `${statusCode}`.startsWith("5"))
    responseData = errorResponse(handler, messageCode, req, data);
  res.status(statusCode).send(responseData);
};

// Default export
export default { send };
