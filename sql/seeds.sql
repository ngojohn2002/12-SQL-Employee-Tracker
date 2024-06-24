-- This SQL script seeds the database with initial data.

-- Seed departments
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Human Resources');
INSERT INTO department (name) VALUES ('Sales');

-- Seed roles
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 80000, (SELECT id FROM department WHERE name='Engineering'));
INSERT INTO role (title, salary, department_id) VALUES ('HR Manager', 90000, (SELECT id FROM department WHERE name='Human Resources'));
INSERT INTO role (title, salary, department_id) VALUES ('Sales Manager', 100000, (SELECT id FROM department WHERE name='Sales'));

-- Seed employees
INSERT INTO employee (first_name, last_name, role_id, manager_id, salary) VALUES ('John', 'Doe', (SELECT id FROM role WHERE title='Software Engineer'), NULL, 80000);
INSERT INTO employee (first_name, last_name, role_id, manager_id, salary) VALUES ('Jane', 'Smith', (SELECT id FROM role WHERE title='HR Manager'), NULL, 90000);
INSERT INTO employee (first_name, last_name, role_id, manager_id, salary) VALUES ('Alice', 'Johnson', (SELECT id FROM role WHERE title='Sales Manager'), NULL, 100000);
