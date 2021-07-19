DROP DATABASE IF EXISTS employeetracker;
CREATE DATABASE employeetracker;
USE employeetracker;
-- order matters so department first,roles and then employee TABLE
CREATE TABLE Departments (
  id INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE Roles (
  id INT NOT NULL AUTO_INCREMENT,
  Title VARCHAR(30) NOT NULL,
  Salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES Departments(id),
  PRIMARY KEY (id)
);
CREATE TABLE Employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY(role_id) REFERENCES Roles(id),
  FOREIGN KEY (manager_id) REFERENCES Roles(id),
  PRIMARY KEY (id)
);