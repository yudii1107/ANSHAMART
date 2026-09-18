const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

module.exports = pool;
pool.query("SELECT NOW()", (error, result) => {
    if (error) {
        console.log("Database connection failed");
    } else {
        console.log("Database connected");
    }
});