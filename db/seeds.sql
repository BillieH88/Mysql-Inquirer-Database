USE employee
INSERT INTO
  Departments (Name)
VALUES
  ("Administration"),
  ("Research and Development"),
  ("Sales"),
  ("Marketing"),
  ("Accounting");
INSERT INTO
  Roles (Title, Salary, department_id)
VALUES
  ("Account Manager", 110000, 3),
  ("Senior Developer", 120000, 2),
  ("Junior Developer", 75000, 2),
  ("Executive Secretary", 70000, 1),
  ("Marketing Associate", 65000, 4),
  ("Account Payable Manager", 60000, 5),
  ("Controller", 110000, 5),
  ("In-house Sales", 45000, 3);
INSERT INTO
  Employees (first_name, last_name, role_id, manager_id)
VALUES
  ("John", "Doe", 1, 8),
  ("Mike", "Chan", 3, 4),
  ("Ashley", "Rodriguez", 4, NULL),
  ("Kevin", "Tupik", 2, NULL),
  ("Malia", "Brown", 7, NULL),
  ("Sarah", "Lourd", 6, 5),
  ("Tom", "Allen", 8, 1),
  ("Christian", "Bale", 5, NULL);