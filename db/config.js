var mysql = require("mysql2");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Billie88*",
  database: "employeetracker",
});

module.exports = connection;
