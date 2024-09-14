import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Implement your login logic here
});

router.post("/token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No refresh token provided" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Invalid refresh token" });
    }

    // Create a new Access Token
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Optionally, issue a new refresh token and update the cookie
    const newRefreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.json({ accessToken });
  });
});

// Export the router with its path
export const authRoutes = {
  path: "/auth",
  router,
};
