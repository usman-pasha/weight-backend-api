// Custom Imports
import responser from "../responser.js";
import logger from "../log.js";
import { Prisma } from "@prisma/client";
import AppError from "./appError.js";

const handlePrismaError = (err) => {
  // ❌ Invalid input / wrong type
  if (err instanceof Prisma.PrismaClientValidationError) {
    return new AppError(400, "auth", "A_E001"); // Required parameters / invalid input
  }

  // ❌ Known Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        // Unique constraint
        return new AppError(400, "auth", "A_E002"); // Email/phone exists

      case "P2025":
        // Record not found
        return new AppError(404, "auth", "A_E004");

      case "P2003":
        // Foreign key violation
        return new AppError(400, "auth", "A_E011");

      default:
        return new AppError(400, "auth", "A_E001");
    }
  }

  return err;
};

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
    return responser.send(500, "global", "G_E001", req, res, err);
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = err;
  // error = handlePrismaError(error);
  sendError(error, req, res);
};

export default globalErrorHandler;
