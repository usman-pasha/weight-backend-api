// Package Imports
import https from "https";
import app from "./app.js";

// Custom Imports
import config from "./config/index.js";
import logger from "./utils/log.js";
import { connectDB } from "./core/db.js";

// Create HTTPS server
const server = https.createServer(app);

// Start server
server.listen(config.PORT, async() => {
  logger.info(`🚀 App is running at http://localhost:${config.PORT}`);
  logger.info(`🌍 Environment: ${app.get("env")}`);
    await connectDB();
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
