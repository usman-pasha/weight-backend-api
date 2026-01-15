import { Service } from "node-windows";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname manually for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the script (index.js) and script options
const scriptPath = path.join(__dirname, 'index.js');
const scriptOptions = path.join(__dirname, 'somewhere', 'special -i');

// Log paths for debugging
console.log(`Script Path: ${scriptPath}`);
console.log(`Script Options: ${scriptOptions}`);

// Create a new service instance for "SHENTON BACKEND"
const svc = new Service({
  name: "SHENTON BACKEND",  // Name of the service
  description: "SHENTON BACKEND SERVICE",  // Description of the service
  script: scriptPath,  // Path to the script that will run the service
  scriptOptions: scriptOptions,  // Options to pass to the script
});

// Listen for events related to the service
svc.on("uninstall", function () {
  console.log("✅ Successfully Uninstalled 'SHENTON BACKEND' service.");
  console.log("Service exists after uninstall:", !svc.exists);
});

// Start the uninstallation process
svc.uninstall();

// Final message indicating uninstallation
console.log("Initiating uninstallation of the service...");
