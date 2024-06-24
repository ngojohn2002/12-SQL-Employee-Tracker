-- Seed departments
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Human Resources');
INSERT INTO department (name) VALUES ('Sales');

-- Seed roles
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 80000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('HR Manager', 90000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Sales Manager', 100000, 3);

-- Seed employees
INSERT INTO employee (first_name, last_name, role_id, manager_id, salary) VALUES ('John', 'Doe', 1, NULL, 80000);
INSERT INTO employee (first_name, last_name, role_id, manager_id, salary) VALUES ('Jane', 'Smith', 2, NULL, 90000);
INSERT INTO employee (first_name, last_name, role_id, manager_id, salary) VALUES ('Alice', 'Johnson', 3, NULL, 100000);
