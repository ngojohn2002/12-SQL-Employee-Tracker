-- Insert sample data into department table
INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('Finance');

-- Insert sample data into role table
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 80000, 1),
  ('Sales Representative', 60000, 1),
  ('Software Engineer', 100000, 2),
  ('Accountant', 70000, 3);

-- Insert sample data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Emily', 'Jones', 3, NULL),
  ('Michael', 'Brown', 4, NULL);
