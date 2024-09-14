import {
  createUser as createUserHelper,
  checkUser as checkUserHelper,
} from "../helper/userHelper.js"; // Ensure to include .js
import { encrypted } from "../utils/encryption.js"; // Ensure to include .js
import { generateToken, generateRefreshToken } from "../utils/generateToken.js"; // Ensure to include .js

const createUser = (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    userTypeId,
    levelId,
    address,
    city,
    state,
  } = req.body;
  const encPassword = encrypted(password);

  createUserHelper(
    firstName,
    lastName,
    email,
    encPassword,
    userTypeId,
    levelId,
    address,
    city,
    state
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log("Error in createUser:", err);
      res.status(500).send("Internal Server Error");
    });
};

const checkUser = async (req, res, next) => {
  const { email, password } = req.body;
  const userDetail = await checkUserHelper(email); // This should probably call the helper function
  if (!userDetail) {
    return res.status(404).send("Email not found");
  }

  const encPassword = encrypted(password);

  if (userDetail.password === encPassword) {
    const accessToken = generateToken(userDetail);
    const refreshToken = generateRefreshToken(userDetail);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Can't be accessed via JavaScript
      secure: true, // Only sent over HTTPS (enable in production)
      sameSite: "Strict", // Prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token as JSON response
    return res.json({ accessToken });
  } else {
    return res.status(403).send("Incorrect Password");
  }
};

export { createUser, checkUser };
