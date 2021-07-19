const inquirer = require("inquirer");
const Database = require("./db/index");
const connection = require("./db/config");
global.db = new Database(connection);

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
      "Add Roles",
      "Remove Roles",
      "Just checking! Want to Exit",
    ],
  },
];

function init() {
  inquirer.prompt(initialQuestionList).then(async (answer) => {
    console.log(answer);
    switch (answer.initialQuestion) {
      case "View All Employees": {
        return db.getAllEmployees().then((data) => {
          console.table(data[0]);
          return AskForMore();
        });
      }
      case "Add Employee": {
        let roleTitles = db.getAllRoleTitles();
        return inquirer.prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "employee_role",
            choices: [roleTitles],
            message: "What is the employee's role?",
          },
          {
            type: "list",
            choices: [roleTitles],
            name: "employee_manager",
            message: "What is the employee's manager?",
          },
        ]);
      }
      case "View All Roles": {
        let roles = await db.getAllRoles();
        console.table(roles[0]);
        return AskForMore();
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
