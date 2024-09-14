import { getDB } from "../utils/dbConnection.js"; // Ensure to include .js

const helper = {};

helper.getUserList = () => {
  const db = getDB();
  return db.fun(""); // Assuming this is a valid function call
};

helper.checkUser = (email) => {
  const db = getDB();
  return db.func("get_validate_user", [email]); // Assuming this is a valid function call
};

helper.createUser = (
  firstName,
  lastName,
  email,
  password,
  userTypeId,
  levelId,
  address,
  city,
  state
) => {
  const db = getDB();
  console.log("Database connection:", db);
  return db.func("create_user", [
    firstName,
    lastName,
    email,
    password,
    userTypeId,
    levelId,
    address,
    city,
    state,
  ]); // Assuming this is a valid function call
};

// Export the helper object
export default helper;
