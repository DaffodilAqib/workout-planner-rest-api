import bcrypt from "bcrypt";

// Example of a static salt, replace with your own secure salt

export const encrypted = (password) => {
  console.log("passs", password, process.env.ENCRYPTION_SALT);
  return new Promise((resolve, reject) => {
    // Hash the password using bcrypt with a predefined static salt
    bcrypt.hash(password, process.env.ENCRYPTION_SALT, function (err, hash) {
      if (err) {
        reject("Cannot encrypt");
      }

      // Return the encrypted password (hashed password)
      console.log("has", hash);
      resolve(hash);
    });
  });
};
