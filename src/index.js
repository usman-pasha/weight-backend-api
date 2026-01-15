// Package Imports
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

// Custom Imports
import config from "./config/index.js";
import logger from "./utils/logger.js";

// Workaround for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SSL Options
const options = {
  key: fs.readFileSync(path.join(__dirname, "certificate", "cert-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "certificate", "cert.pem")),
};

// Create HTTPS server
const server = https.createServer(options, app);

// Start server
server.listen(config.PORT, "127.0.0.1", () => {
  logger.info(`🚀 App is running at https://localhost:${config.PORT}`);
  logger.info(`🌍 Environment: ${app.get("env")}`);
});

// Graceful shutdown
server.on("close", () => {
  logger.info("🛑 Server closed");
  server.close();
});

process.on("SIGINT", () => {
  server.emit("close");
  process.exit(0);
});
