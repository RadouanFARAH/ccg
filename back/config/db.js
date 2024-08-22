// lib/db.js
const mysql = require('mysql');
const con = mysql.createPool({
  host: process.env.DBURL,
  port:'3306',
  user: process.env.DBUSER,
  database: process.env.DBNAME,
  password: process.env.DBPWD,
  connectionLimit:3000
});

module.exports = con
