import fs from "fs";
import path from "path";
import { authenticateUser } from "../middleware/auth.js"; // Ensure to include .js
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generic route loader
export const loadRoutes = async (app) => {
  const routesPath = path.join(__dirname, "../routes");
  // Read all files in the routes folder
  const files = fs.readdirSync(routesPath);
  for (const file of files) {
    const route = await import(path.join(routesPath, file)); // Dynamic import
    const fileName = file.split(".")[0];
    console.log(">>>>>fileName", fileName);
    // Apply the route to the app
    if (route[fileName].requiresAuth) {
      app.use(route[fileName].path, authenticateUser, route[fileName].router); // Apply auth middleware
    } else {
      console.log(">>>>>fileName", fileName);

      app.use(route[fileName].path, route[fileName].router); // No auth middleware for this route
    }
  }
};
