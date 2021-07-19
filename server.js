const inquirer = require("inquirer");
const Database = require("./db/index");
const connection = require("./db/config");
global.db = new Database(connection);
require("console.table");

const initialQuestionList = [
  {
    type: "list",
    name: "initialQuestion",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Employees by Department",
      "View All Employees By Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "View All Roles",
      "Add Role",
      "Remove Role",
      "Just checking! Want to Exit",
    ],
  },
];

function init() {
  inquirer.prompt(initialQuestionList).then(async (answer) => {
    // console.log(answer);
    switch (answer.initialQuestion) {
      case "View All Employees": {
        return db.getAllEmployees().then((data) => {
          console.table(data[0]);
          return AskForMore();
        });
      }
      case "View All Employees by Department": {
        let departments = await db.getAllDepartments();
        let departmentChoices = departments[0].map((department) => {
          // console.log(department);
          return department.name;
        });
        let answer = await inquirer.prompt({
          type: "list",
          name: "departmentToView",
          choices: departmentChoices,
        });
        // console.log(answer);
        return db
          .getEmployeesByDepartment(answer.departmentToView)
          .then((data) => {
            console.table(data[0]);
            return AskForMore();
          });
      }
      case "View All Employees By Manager": {
        let managers = await db.getAllManagers();
        let managerChoices = managers[0].map((manager) => {
          return manager.manager;
        });
        let answer = await inquirer.prompt({
          type: "list",
          name: "managerToViewEmployees",
          choices: managerChoices,
        });
        // console.log(answer);
        return db
          .getEmployeesByManager(answer.managerToViewEmployees)
          .then((data) => {
            console.table(data[0]);
            return AskForMore();
          });
      }
      case "Add Employee": {
        let roleTitles = await db.getAllRoleTitles();
        let roleChoices = roleTitles[0].map((role) => {
          return role.title;
        });
        let managers = await db.getAllManagers();
        let managerChoices = managers[0].map((manager) => {
          return manager.manager;
        });
        return inquirer
          .prompt([
            {
              type: "input",
              required: true,
              name: "first_name",
              message: "What is the employee's first name?",
            },
            {
              type: "input",
              required: true,
              name: "last_name",
              message: "What is the employee's last name?",
            },
            {
              type: "list",
              required: true,
              name: "employee_role",
              choices: roleChoices,
              message: "What is the employee's role?",
            },
            {
              type: "list",
              required: true,
              choices: managerChoices,
              name: "employee_manager",
              message: "Who is the employee's manager?",
            },
          ])
          .then((answers) => {
            let { first_name, last_name, employee_role, employee_manager } =
              answers;
            let role = roleTitles[0].find(
              (role) => role.title == employee_role
            );
            let manager = managers[0].find(
              (manager) => manager.manager == employee_manager
            );
            let combinedEmployeeDetail = {
              first_name,
              last_name,
              role_id: role.id,
              manager_id: manager.id,
            };
            return db.addEmployee(combinedEmployeeDetail).then(() => {
              return AskForMore();
            });
          });
      }

      case "Remove Employee": {
        let employees = await db.getAllEmployees();
        const allEmpObject = employees[0];
        const builtEmp = allEmpObject.map((emp) => {
          return { id: emp.id, fullName: emp.first_name + " " + emp.last_name };
        });
        const builtEmpFullNames = builtEmp.map((emp) => emp.fullName);
        return inquirer
          .prompt([
            {
              type: "list",
              required: true,
              name: "employee",
              choices: builtEmpFullNames,
              message: "Which Employee do you want to remove?",
            },
          ])
          .then((answer) => {
            const employeeIndex = builtEmpFullNames.indexOf(answer.employee);
            const employeeId = allEmpObject[employeeIndex].id;
            return db.removeEmployee(employeeId).then(() => {
              return AskForMore();
            });
          });
      }
      case "Update Employee Role": {
        let employees = await db.getAllEmployees();
        const allEmpObject = employees[0];
        const builtEmp = allEmpObject.map((emp) => {
          return { id: emp.id, fullName: emp.first_name + " " + emp.last_name };
        });
        const builtEmpFullNames = builtEmp.map((emp) => emp.fullName);
        const roles = await db.getAllRoles();
        const allRoles = roles[0];
        let roleChoices = allRoles.map((role) => role.title);
        return inquirer
          .prompt([
            {
              type: "list",
              required: true,
              name: "employee",
              choices: builtEmpFullNames,
              message: "Which Employee do you want to change their role?",
            },
            {
              type: "list",
              required: true,
              name: "role",
              choices: roleChoices,
              message: "What is their new role?",
            },
          ])
          .then((answer) => {
            const employeeIndex = builtEmpFullNames.indexOf(answer.employee);
            const roleIndex = roleChoices.indexOf(answer.role);
            const roleId = allRoles[roleIndex].id;
            const employeeId = allEmpObject[employeeIndex].id;
            return db.updateEmployeeRole({ employeeId, roleId }).then(() => {
              return AskForMore();
            });
          });
      }
      case "Update Employee Manager": {
        let employees = await db.getAllEmployees();
        const allEmpObject = employees[0];
        const builtEmp = allEmpObject.map((emp) => {
          return {
            id: emp.id,
            fullName: emp.first_name + " " + emp.last_name,
          };
        });
        const builtEmpFullNames = builtEmp.map((emp) => emp.fullName);
        const managers = await db.getAllManagers();
        const allManagers = managers[0];
        let managerChoices = allManagers.map((manager) => manager.manager);
        return inquirer
          .prompt([
            {
              type: "list",
              required: true,
              name: "employee",
              choices: builtEmpFullNames,
              message: "Which Employee do you want to change their Manager?",
            },
            {
              type: "list",
              required: true,
              name: "manager",
              choices: managerChoices,
              message: "Who is their new manager?",
            },
          ])
          .then((answer) => {
            const employeeIndex = builtEmpFullNames.indexOf(answer.employee);
            const managerIndex = managerChoices.indexOf(answer.manager);
            const managerId = allManagers[managerIndex].id;
            const employeeId = allEmpObject[employeeIndex].id;
            return db
              .updateEmployeeManager({ employeeId, managerId })
              .then(() => {
                return AskForMore();
              });
          });
      }
      case "View All Roles": {
        let roles = await db.getAllRoles();
        console.table(roles[0]);
        return AskForMore();
      }
      case "Add Role": {
        let departments = await db.getAllDepartments();
        let departmentChoices = departments[0].map((department) => {
          return department.name;
        });
        return inquirer
          .prompt([
            {
              type: "input",
              required: true,
              name: "title",
              message: "What is the role title?",
            },
            {
              type: "input",
              required: true,
              name: "salary",
              message: "What is the salary of this role?",
            },
            {
              type: "list",
              required: true,
              name: "department",
              choices: departmentChoices,
              message: "Which department do you want to put this role?",
            },
          ])
          .then(async (answer) => {
            let { salary, title, department } = answer;
            let selectedDepartment = departments[0].find(
              (departmentI) => departmentI.name == department
            );
            let newRoleData = {
              salary,
              title,
              department_id: selectedDepartment.id,
            };
            return db.addRole(newRoleData).then(() => {
              return AskForMore();
            });
          });
      }
      case "Remove Role": {
        let roleTitles = await db.getAllRoleTitles();
        let roleChoices = roleTitles[0].map((role) => {
          return role.title;
        });
        return inquirer
          .prompt([
            {
              type: "list",
              required: true,
              name: "roleToRemove",
              choices: roleChoices,
              message: "Which role do you want to remove?",
            },
          ])
          .then(async (answer) => {
            let roleToRemove = roleTitles[0].find(
              (role) => role.title === answer.roleToRemove
            );
            console.log(roleToRemove.id);
            let roles = await db.removeRole(roleToRemove.id);
            console.table(roles[0]);
            return AskForMore();
          });
      }

      default:
        return ExitCli();
    }
  });
}

//For exiting the whole CLI
const ExitCli = () => process.exit(0);

// Ask for more Goes back to CLI main menu or exit whole CLI
const AskForMore = () =>
  inquirer
    .prompt([
      {
        name: "moreQuery",
        type: "confirm",
        message: "Want to do anything else?",
      },
    ])
    .then((answer) => {
      if (answer.moreQuery) return init();
      else return ExitCli();
    });

init();
