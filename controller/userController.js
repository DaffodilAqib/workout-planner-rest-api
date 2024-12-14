import {
  createUser as createUserHelper,
  checkUser as checkUserHelper,
} from "../helper/userHelper.js"; // Ensure to include .js
import { encrypted } from "../utils/encryption.js"; // Ensure to include .js
import { generateToken, generateRefreshToken } from "../utils/generateToken.js"; // Ensure to include .js

const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const encPassword = await encrypted(password);
  console.log("dfdfsdfsd", encPassword);

  createUserHelper(firstName, lastName, email, encPassword)
    .then((result) => {
      console.log("result", result);
      const accessToken = generateToken(result[0]);
      const refreshToken = generateRefreshToken(result[0]);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Can't be accessed via JavaScript
        secure: true, // Only sent over HTTPS (enable in production)
        sameSite: "Strict", // Prevent CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Send access token as JSON response
      return res.json({ accessToken });
    })
    .catch((err) => {
      console.log("Error in createUser:", err);
      res.status(500).send("Internal Server Error");
    });
};

const checkUser = async (req, res, next) => {
  const { email, password } = req.body;
  const userDetail = await checkUserHelper(email); // This should probably call the helper function
  if (!userDetail || !userDetail.length) {
    return res.status(404).send("Email not found");
  }

  let encPassword;
  try {
    encPassword = await encrypted(password);
  } catch (err) {
    console.log("errrrrrrr", err);
  }

  console.log("userDetail.password", userDetail, encPassword);
  if (userDetail[0].password === encPassword) {
    const user = { ...userDetail[0], password: null };
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

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
