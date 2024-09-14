import pgPromise from "pg-promise";
const pgp = pgPromise();
let db;

export const connect = async () => {
  db = pgp({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  return db.connect();
};

export const getDB = () => {
  return db;
};
