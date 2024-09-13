const pgp = require('pg-promise')();

let db;
const connect = () => {
    console.log("db detail", ({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    }))
    db = pgp({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })
    return db.connect(); 
}

const getDB = () => {
    return db;
}

module.exports = {
    connect,
    getDB
}