import express from "express";
import { createUser } from "../controller/userController.js";

const router = express.Router();

router.get("/list", (req, res, next) => {
    res.send("List of users");
});

router.post("/add", createUser);

// Export the router with its path and authentication requirements
export const userRoutes = {
    path: "/users",
    router
};
