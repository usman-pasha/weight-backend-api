import logger from "../utils/log.js";
import responser from "../utils/responser.js";
import authService from "../services/auth.service.js";
class AuthController {
  async register(req, res) {
    logger.info("registration starting");
    const reqData = req.body;
    const data = await authService.register(reqData);
    return responser.send(200, "auth", "A_S001", req, res, data);
  }

  async validatePhoneOTP(req, res) {
    logger.info("validate Phone OTP starting");
    const reqData = req.body;
    const data = await authService.validatePhoneOTP(reqData);
    return responser.send(
      200,
      "Validate Phone OTP Successfully",
      req,
      res,
      data
    );
  }

  async resentOTP(req, res) {
    logger.info("Resent OTP starting");
    const reqData = req.body;
    const data = await authService.resendOTP(reqData);
    return responser.send(
      200,
      "Successfully Resent OTP",
      req,
      res,
      data
    );
  }

  async login(req, res) {
    logger.info("login starting");
    const reqData = req.body;
    const data = await authService.login(reqData);
    return responser.send(
      200,
      "auth",
      "A_S004",
      req,
      res,
      data
    );
  }

  // STEP 1: Redirect to Google
  async googleLogin(req, res) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.CALLBACK_URL,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    const googleUrl =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      params.toString();
    return res.redirect(googleUrl);
  }

  // STEP 2: Google callback
  async googleCallback(req, res, next) {
    const data = await authService.googleAuth(req.query.code);
    return responser.send(
      200,
      "auth",
      "A_S006",
      req,
      res,
      data
    );
  }
}

export default new AuthController();
