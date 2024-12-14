import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connect } from "./utils/dbConnection.js";
import { loadRoutes } from "./utils/syncRoutes.js";
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Function to start the server
const startServer = async () => {
  try {
    await connect();
    console.log("DB connected successfully");

    // Create the Express server
    const app = express();

    app.use(cookieParser());

    // CORS setup
    const corsOptions = {
      origin: '*', // Replace with your frontend's URL
      optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));

    // Middleware for parsing JSON
    app.use(express.json());

    // Load routes
    loadRoutes(app);

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

// Start the server
startServer();
