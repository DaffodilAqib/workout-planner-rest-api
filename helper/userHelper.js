const { getDB } = require("../utils/dbConnection");

helper = {

};

helper.getUserList = () => {
    const db = getDB();
    return db.fun('');
}

helper.checkUser = (email) => {
    const db = getDB();
    return db.func('get_validate_user', [email]);
}

helper.createUser = (firstName, lastName, email, password, userTypeId, levelId, address, city, state) => {
    const db = getDB();
    console.log("dbdfdbdfdfa", db);
    return db.func('create_user', [firstName, lastName, email, password, userTypeId, levelId, address, city, state]);
}

module.exports = helper;