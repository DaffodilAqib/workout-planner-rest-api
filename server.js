import cluster from "cluster";
import os from "os";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connect } from "./utils/dbConnection.js";
import { loadRoutes } from "./utils/syncRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Function to start the server
const startServer = async () => {
  try {
    await connect();
    console.log("DB connected successfully");

    if (cluster.isMaster) {
      // Get the number of CPU cores
      const numCPUs = os.cpus().length;

      // Fork workers for each CPU core
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      // Event listener for worker exits
      cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log("Forking a new worker...\n");
        cluster.fork();
      });
    } else {
      // Worker processes create the Express server
      const app = express();
      app.use(cookieParser());

      // Middleware for parsing JSON
      app.use(express.json());

      loadRoutes(app);

      // Start the server
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(
          `Server is running on PORT ${PORT} by worker ${process.pid}`
        );
      });
    }
  } catch (err) {
    console.log("Unable to connect with DB", err);
  }
};

// Start the server
startServer();
