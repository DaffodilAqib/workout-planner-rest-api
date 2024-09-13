const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Check if the error is due to token expiration
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Unauthorized: Token has expired' });
        } else {
          return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
      }

      req.user = decoded; // Attach decoded token (user info) to request object
      next();
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};


module.exports = {
    authenticateUser
}