const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'Votaciones',
    user: 'root',
    password: 'password'
});

const getConnection = () => {
    return connection.promise();
}

module.exports = {
    getConnection
}