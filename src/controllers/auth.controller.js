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
}

export default new AuthController();
