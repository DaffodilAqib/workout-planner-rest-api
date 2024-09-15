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
) => {
    const db = getDB();
    return db.func("create_user", [
        firstName,
        lastName,
        email,
        password
    ]); // Assuming this is a valid function call
};

const updateUser = (userId, gender, age, height, weight, trainingType, trainingLevel, injuries) => {
    const db = getDB();
    console.log("dfsdffinal ", userId, gender, age, height, weight, trainingType, trainingLevel, injuries);
    return db.func("update_user_detail", [
        userId, gender, age, height, weight, trainingType, trainingLevel, injuries
    ]); // Assuming this is a valid function call
}

// Export the helper object
export { createUser, checkUser, getUserList, updateUser };
