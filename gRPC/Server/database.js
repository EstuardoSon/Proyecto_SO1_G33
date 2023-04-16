const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD
});

const getConnection = () => {
    return connection;
}

module.exports = {
    getConnection
}