// https://www.positronx.io/how-to-fetch-show-data-from-mysql-database-in-node-js/
require('dotenv').config()
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'sakila',
})

connection.connect((err) => {
  if (err) throw err
  // console.log('Database connected')
})
module.exports = connection
