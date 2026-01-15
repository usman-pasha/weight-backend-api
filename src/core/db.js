import pkg from '@prisma/client';
import logger from "../utils/log.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const connectDB = async () => {
    try {
        logger.info('Connecting to Database')
        await prisma.$connect();
        logger.info('✅ Database connected successfully');
    } catch (error) {
        logger.error('❌ Database connection failed', error);
        process.exit(1);
    }
}

export default prisma;