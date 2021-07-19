var mysql = require("mysql2");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root95@boye",
  database: "employeetracker",
});

module.exports = connection;
