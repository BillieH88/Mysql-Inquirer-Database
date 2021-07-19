const connection = require("../db/config");

class Database {
  constructor(connection) {
    this.connection = connection;
  }
  getAllDepartments() {
    return this.connection
      .promise()
      .query("SELECT id, name FROM Departments")
      .catch((err) => err);
  }

  getEmployeesByDepartment(departmentName) {
    return this.connection
      .promise()
      .query(
        `SELECT sub.id, sub.first_name, sub.last_name, roles.title, departments.name as department,  roles.salary, concat(sup.first_name, " ", sup.last_name)  as manager FROM Employees sub
        LEFT JOIN roles ON sub.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees sup ON sub.manager_id = sup.id
        WHERE departments.name = "${departmentName}"`
      )
      .catch((err) => err);
  }

  getAllManagers() {
    return this.connection
      .promise()
      .query(
        `SELECT sup.id, concat(sup.first_name, " ", sup.last_name)  as manager FROM Employees sub
        JOIN employees sup ON sub.manager_id = sup.id`
      )
      .catch((err) => err);
  }

  getEmployeesByManager(managerName) {
    return this.connection
      .promise()
      .query(
        `SELECT sub.id, sub.first_name, sub.last_name, roles.title, departments.name as department,  roles.salary, concat(sup.first_name, " ", sup.last_name)  as manager FROM Employees sub
        LEFT JOIN roles ON sub.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees sup ON sub.manager_id = sup.id
        WHERE concat(sup.first_name, " ", sup.last_name) = "${managerName}"`
      )
      .catch((err) => err);
  }

  addDepartment(departmentName) {
    return this.connection
      .promise()
      .query(`INSERT into departments (name) VALUES (${departmentName})`)
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
  addRole({ title, salary, department_id }) {
    salary = parseInt(salary);
    return this.connection
      .promise()
      .query(
        `INSERT into roles (title, salary ,department_id) VALUES("${title}", ${salary} ,${department_id})`
      )
      .catch((err) => err);
  }

  removeRole(roleId) {
    return this.connection
      .promise()
      .query(`DELETE from roles WHERE id="${roleId}"`)
      .catch((err) => err);
  }

  getAllRoleTitles() {
    return this.connection
      .promise()
      .query("SELECT id, title  FROM Roles")
      .catch((err) => err);
  }

  getAllEmployees() {
    return this.connection
      .promise()
      .query(
        `SELECT sub.id, sub.first_name, sub.last_name, roles.title, departments.name as department,  roles.salary, concat(sup.first_name, " ", sup.last_name)  as manager FROM Employees sub
        LEFT JOIN roles ON sub.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees sup ON sub.manager_id = sup.id
        `
      )
      .catch((err) => err);
  }

  addEmployee({ first_name, last_name, role_id, manager_id }) {
    console.log("from db", { first_name, last_name, role_id, manager_id });
    return this.connection
      .promise()
      .query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id})    `
      )
      .catch((err) => err);
  }
  removeEmployee(employeeId) {
    console.log("from db", employeeId);
    employeeId = parseInt(employeeId);
    return this.connection
      .promise()
      .query(`DELETE from employees WHERE id="${employeeId}"`)
      .catch((err) => err);
  }
  updateEmployeeRole({ employeeId, roleId }) {
    employeeId = parseInt(employeeId);
    roleId = parseInt(roleId);
    return this.connection
      .promise()
      .query(
        `UPDATE employees SET role_id="${roleId}"  WHERE id="${employeeId}"`
      )
      .catch((err) => err);
  }
  updateEmployeeManager({ employeeId, managerId }) {
    employeeId = parseInt(employeeId);
    managerId = parseInt(managerId);
    return this.connection
      .promise()
      .query(
        `UPDATE employees SET manager_id="${managerId}"  WHERE id="${employeeId}"`
      )
      .catch((err) => err);
  }
}

module.exports = Database;
