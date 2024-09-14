import { getDB } from "../utils/dbConnection.js"; // Ensure to include .js
const getUserList = () => {
  const db = getDB();
  return db.fun(""); // Assuming this is a valid function call
};

const checkUser = (email) => {
  const db = getDB();
  return db.func("get_validate_user", [email]); // Assuming this is a valid function call
};

const createUser = (
  firstName,
  lastName,
  email,
  password,
  userTypeId,
  levelId,
  address,
  city,
  state,
  gender,
  age,
  height,
  weight,
  injuries,
  trainingType
) => {
  const db = getDB();
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
    gender,
    age,
    height,
    weight,
    injuries,
    trainingType,
  ]); // Assuming this is a valid function call
};

// Export the helper object
export { createUser, checkUser, getUserList };
