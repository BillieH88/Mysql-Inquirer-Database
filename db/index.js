const connection = require("../db/config");

class Database {
  constructor(connection) {
    this.connection = connection;
  }

  getAllDepartments() {
    return this.connection
      .promise()
      .query("SELECT Departments.Name FROM Departments")
      .catch((err) => err);
  }

  getAllRoles() {
    return this.connection
      .promise()
      .query(
        `SELECT roles.id, roles.title, roles.salary, departments.name from roles LEFT JOIN departments on roles.department_id =departments.id`
      )
      .catch((err) => err);
  }

  getAllRoleTitles() {
    return this.connection
      .promise()
      .query("SELECT Roles.id, Roles.Title,  FROM Roles")
      .catch((err) => err);
  }

  getAllEmployees() {
    return this.connection
      .promise()
      .query(
        `SELECT employees.id, employees.first_name, employess.last_name roles.title, departments.name as department, roles.salary FROM Employees
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        `
      )
      .catch((err) => err);
  }
}

module.exports = Database;
