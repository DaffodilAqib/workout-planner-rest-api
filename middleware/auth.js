import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("check", authHeader && authHeader.startsWith("Bearer "));
  if (authHeader && authHeader.startsWith("Bearer ")) {
    console.log(authHeader);
    const token = authHeader.split(" ")[1];
    console.log("token", token);

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      console.log("errr", err);
      if (err) {
        // Check if the error is due to token expiration
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Unauthorized: Token has expired" });
        } else {
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token" });
        }
      }
      console.log("dfdff", decoded);
      req['user'] = decoded; // Attach decoded token (user info) to request object
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
};
