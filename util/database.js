const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'example',
    password: 'p@ssw0rd'
});

module.exports = pool.promise();