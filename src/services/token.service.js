import prisma from "../core/db.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { signToken as generateToken } from "../middlewares/token.js";

/**
 * Create login session (ACCESS + REFRESH)
 */
export const createLogin = async (user, ip = null) => {
  const payload = {
    userId: user.id,
    jwtToken: generateToken(user.id, "access"),
    refreshToken: generateToken(user.id, "refresh"),
    createdByIp: ip,
  };

  const token = await prisma.token.create({
    data: payload,
  });

  const totalLogin = await prisma.token.count({
    where: {
      userId: user.id,
    },
  });

  return {
    id: user.id,
    totalLogin,
    email: user.email,
    phoneNumber: user.phoneNumber,
    username: user.username,
    accountType: user.accountType,
    profilePicture: user.profilePicture,
    token: token.jwtToken,
    refreshToken: token.refreshToken,
  };
};

/**
 * Find single token
 */
export const findOneToken = async (where) => {
  return prisma.token.findFirst({
    where,
  });
};

/**
 * Delete token by ID (logout single session)
 */
export const deleteToken = async (tokenId) => {
  return prisma.token.delete({
    where: { id: tokenId },
  });
};

/**
 * Update token (invalidate / rotate)
 */
export const updateToken = async (where, updateData) => {
  return prisma.token.updateMany({
    where,
    data: updateData,
  });
};

/**
 * Sign ACCESS token (15 minutes)
 */
export const signAccessToken = async (userId) => {
  return jwt.sign({ id: userId }, config.ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * Verify ACCESS token
 */
export const tokenVerify = async (token) => {
  return jwt.verify(token, config.ACCESS_SECRET);
};

/**
 * Sign REFRESH token (30 days)
 */
export const signRefreshToken = async (userId) => {
  return jwt.sign({ id: userId }, config.REFRESH_SECRET, {
    expiresIn: "30d",
  });
};
