import express from "express";
import authController from "../controllers/auth.controller.js";
import catchError from "../utils/error/catchError.js";
import { verifyAuth,authorizePermissions } from "../middlewares/auth.js";

const authRoute = express.Router();

authRoute.route("/register").post(catchError(authController.register));
authRoute.route("/validateOTP").post(catchError(authController.validatePhoneOTP));
authRoute.route("/resendOtp").post(catchError(authController.resentOTP));
authRoute.route("/login").post(catchError(authController.login));

authRoute.get("/google", authController.googleLogin);
authRoute.get("/google/callback", authController.googleCallback);

export default authRoute;
