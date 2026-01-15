// config.js (ES Module version)
import 'dotenv/config';

const config = {
  PORT: process.env.PORT,
  statusCode: [200, 500, 401, 400, 403],
  MAXFILES: "7d",
  LABEL: 'SHENTON-APS'
};

export default config;
