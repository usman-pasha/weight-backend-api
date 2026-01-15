import AppError from "../utils/error/appError.js";
import prisma from "../core/db.js";
import logger from "../utils/log.js";
import { signToken } from "../middlewares/token.js";

class UserService {
  async createRecord(data) {
    return prisma.user.create({ data });
  }

  async getRecord(where) {
    return prisma.user.findUnique({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
      },
    });
  }

  async getAllRecords(where = {}) {
    return prisma.user.findMany({ where });
  }

  async getUserByEmail(email, fields = [
    "id",
    "email",
    "username",
    "password",
    "phoneNumber",
    "firstLogin",
    "createdAt",
    "updatedAt",
  ]) {
    const select = {};
    for (const field of fields) {
      select[field] = true;
    }

    return prisma.user.findUnique({
      where: { email },
      select,
    });
  }
}

export default new UserService();
