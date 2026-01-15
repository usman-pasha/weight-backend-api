// config.js (ES Module version)
import 'dotenv/config';

const config = {
  PORT: process.env.PORT,
  ACCESS_VALIDITY: process.env.ACCESS_VALIDITY,
  ACCESS_SECRET: process.env.ACCESS_SECRET,
  REFRESH_VALIDITY: process.env.REFRESH_VALIDITY,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
  USEREMAIL: process.env.USEREMAIL,
  CLOUD_NAME: process.env.CLOUD_NAME,
  IMAGE_API_KEY: process.env.IMAGE_API_KEY,
  IMAGE_API_SECRET: process.env.IMAGE_API_SECRET,
};

export default config;
