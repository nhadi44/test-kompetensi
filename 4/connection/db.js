const mysql = require('mysql2')

const connectionPool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@nurhidayat97',
    database: 'db_taks_collection'
})

module.exports = connectionPool