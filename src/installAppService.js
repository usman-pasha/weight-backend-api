import { Service } from "node-windows";
import path from "path";
import { fileURLToPath } from "url";

// Manually define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths for the script and script options
const scriptPath = path.join(__dirname, 'index.js');
const scriptOptions = path.join(__dirname, 'somewhere', 'special -i');

// Log the paths to confirm they are correct
console.log(`Script Path: ${scriptPath}`);
console.log(`Script Options: ${scriptOptions}`);

// Create a new service instance for "SHENTON BACKEND"
const svc = new Service({
  name: "SHENTON BACKEND",  // Service name
  description: "SHENTON BACKEND SERVICE",  // Service description
  script: scriptPath,  // Path to the script to run
  scriptOptions: scriptOptions,  // Options passed to the script
});

// Event handler for when the service is successfully installed
svc.on("install", function () {
  console.log("✅ Service 'SHENTON BACKEND' installed successfully.");
  svc.start();
});

// Event handler for when the service installation fails
svc.on("error", function (err) {
  console.error("❌ Error installing service:", err);
});

// Log entry point to the installation process
console.log("Starting installation of 'SHENTON BACKEND' service...");

// Install and uninstall the service (can be triggered in different scenarios)
svc.install();
svc.uninstall();

// Log after uninstalling
console.log("Initiating uninstallation of the service...");

// Final log message to indicate process completion
console.log("Service installation/uninstallation process completed.");
