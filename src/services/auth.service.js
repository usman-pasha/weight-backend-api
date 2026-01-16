import AppError from "../utils/error/appError.js";
import prisma from "../core/db.js";
import logger from "../utils/log.js";
import userService from "./user.service.js";
import { signToken, hashPassword, compareHashPassword } from "../middlewares/token.js";
import * as tokenSerice from "./token.service.js"
import { v4 as uuidv4 } from 'uuid';
import { generateOTP } from "../utils/utils.js";
import eventBus from "../core/eventEmitter.js";
import { EVENTS } from "../core/events.js";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  // ================= REGISTER =================
  async register(body) {
    logger.info("Creating Register");

    if (!body.email || !body.password || !body.phoneNumber) {
      throw new AppError(400, "auth", "A_E001");
    }

    const isEmailExist = await userService.getRecord({ email: body.email });
    if (isEmailExist) {
      throw new AppError(400, "auth", "A_E002");
    }

    const isPhoneExist = await userService.getRecord({
      phoneNumber: body.phoneNumber,
    });
    if (isPhoneExist) {
      throw new AppError(400, "auth", "A_E003");
    }

    const uniqueUserName = `US${uuidv4()
      .toUpperCase()
      .replace(/-/g, "")
      .substring(0, 9)}`;

    const payload = {
      username: uniqueUserName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: hashPassword(body.password),
      emailOtp: generateOTP().toString(),
      phoneOtp: generateOTP().toString(),
      phoneOtpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      emailOtpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      status: "active",
      authProvider: "local"
    };

    if (body.firstName) payload.firstName = body.firstName
    if (body.lastName) payload.lastName = body.lastName

    const user = await userService.createRecord(payload);
    // event bus
    eventBus.emit(EVENTS.USER_REGISTER, {
      userId: user.id,
      source: "system",
      email: user.email,
      timestamp: new Date()
    });
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      accountType: user.accountType,
      phoneNumber: user.phoneNumber,
      status: user.status,
    };
  }

  // ================= VALIDATE PHONE OTP =================
  async validatePhoneOTP(body) {
    logger.info("Validate Phone OTP");

    if (!body.phone || !body.phoneOTP) {
      throw new AppError(400, "auth", "A_E001");
    }

    const user = await prisma.user.findUnique({
      where: { phoneNumber: body.phone },
    });

    if (!user) {
      throw new AppError(404, "auth", "A_E004");
    }

    if (!user.otpExpiry) {
      throw new AppError(400, "auth", "A_E006");
    }

    if (Date.now() > user.otpExpiry.getTime()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { phoneOtp: null, otpExpiry: null },
      });
      throw new AppError(400, "auth", "A_E005");
    }

    if (body.phoneOTP !== user.phoneOtp) {
      throw new AppError(400, "auth", "A_E006");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneIsVerified: true,
        phoneOtp: null,
        otpExpiry: null,
        status: "active",
      },
    });

    return true;
  }

  // ================= RESEND OTP =================
  async resendOTP(body) {
    logger.info("Resend OTP Started");

    if (!body.phone) {
      throw new AppError(400, "auth", "A_E001");
    }

    const user = await prisma.user.findUnique({
      where: { phoneNumber: body.phone },
    });

    if (!user) {
      throw new AppError(404, "auth", "A_E004");
    }

    if (user.phoneIsVerified) {
      throw new AppError(400, "auth", "A_E007");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneOtp: generateOTP().toString(),
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return true;
  }

  // ================= LOGIN =================
  async login(body) {
    logger.info("Login service started");

    if (!body.phone && !body.email) {
      throw new AppError(400, "auth", "A_E008");
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber: body.phone }, { email: body.email }],
      },
    });

    if (!user) {
      throw new AppError(404, "auth", "A_E004");
    }

    if (
      (!user.phoneIsVerified || !user.emailIsVerified) &&
      user.status !== "active"
    ) {
      throw new AppError(403, "auth", "A_E010");
    }

    const isPasswordValid = compareHashPassword(body.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, "auth", "A_E009");
    }
    console.log("user", user);

    const record = await tokenSerice.createLogin(user);
    return record
  }

  // ================= CURRENT USER =================
  async getCurrentUser(userId) {
    logger.info("Get current user");

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, "auth", "A_E004");
    }

    return {
      id: user.id,
      username: user.username,
      fullName: `${user.firstName}-${user.lastName}`,
      email: user.email,
      status: user.status,
      uuid: user.uuid,
      accountType: user.accountType,
      phoneNumber: user.phoneNumber,
    };
  }

  async googleAuth(code) {
    if (!code) {
      throw new AppError(400, "auth", "A_E001");
    }

    // 1️⃣ Exchange authorization code for Google tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.CALLBACK_URL,
        grant_type: "authorization_code",
      }
    );

    const { id_token } = tokenRes.data;

    if (!id_token) {
      throw new AppError(401, "auth", "A_E011");
    }

    // 2️⃣ VERIFY Google ID token (SECURE ✅)
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googleUser = ticket.getPayload();
    console.log("g", googleUser)

    if (!googleUser?.email) {
      throw new AppError(401, "auth", "A_E011");
    }

    const {
      sub: googleId,
      email,
      given_name,
      family_name,
      picture
    } = googleUser;

    // 3️⃣ Find or create user
    let user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          username: `GU${Date.now()}`,
          authProvider: "google",
          firstName: given_name,
          lastName: family_name,
          emailIsVerified: true, // Google emails are verified
          status: "active",
          profilePicture: picture
        },
      });

    }

    // 4️⃣ Create session using token service (UNIFIED LOGIN ✅)
    const record = await tokenSerice.createLogin(user);

    return record;
  }

}

export default new AuthService();
