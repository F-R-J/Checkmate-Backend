const mysql = require("mysql");
const database = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'checkmate',
});
database.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected Successfully...");
});
module.exports = database;