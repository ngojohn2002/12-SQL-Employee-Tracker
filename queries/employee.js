// This file defines the Employee class with methods for CRUD operations and other queries on the employee table.

const pool = require("../db/connection");

class Employee {
  constructor(pool) {
    this.pool = pool;
  }

  // Retrieve all employees with sorting options
  async getEmployees(sortBy = "employee.id", order = "ASC") {
    const validSortColumns = {
      id: "employee.id",
      first_name: "employee.first_name",
      last_name: "employee.last_name",
      title: "role.title",
      department: "department.name",
      salary: "employee.salary",
    };

    const sortColumn = validSortColumns[sortBy] || "employee.id";
    const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, 
             employee.salary AS employee_salary, 
             CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id
      ORDER BY ${sortColumn} ${order}
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  // Display all employees
  async displayEmployees(sortBy = "employee.id", order = "ASC") {
    try {
      const employees = await this.getEmployees(sortBy, order);
      const formattedEmployees = employees.map((employee) => ({
        ID: employee.id,
        "First Name": employee.first_name,
        "Last Name": employee.last_name,
        Title: employee.title,
        Department: employee.department,
        "Employee Salary": new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(employee.employee_salary),
        Manager: employee.manager || "None",
      }));
      console.table(formattedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  }

  // Add a new employee
  async addEmployee(firstName, lastName, roleId, managerId, salary) {
    const query = `
      INSERT INTO employee (first_name, last_name, role_id, manager_id, salary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [firstName, lastName, roleId, managerId, salary];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  // Update employee's first name
  async updateEmployeeFirstName(employeeId, firstName) {
    const query =
      "UPDATE employee SET first_name = $1 WHERE id = $2 RETURNING *";
    const result = await this.pool.query(query, [firstName, employeeId]);
    return result.rows[0];
  }

  // Update employee's last name
  async updateEmployeeLastName(employeeId, lastName) {
    const query =
      "UPDATE employee SET last_name = $1 WHERE id = $2 RETURNING *";
    const result = await this.pool.query(query, [lastName, employeeId]);
    return result.rows[0];
  }

  // Update employee's role
  async updateEmployeeRole(employeeId, roleId) {
    const query = "UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *";
    const result = await this.pool.query(query, [roleId, employeeId]);
    return result.rows[0];
  }

  // Update employee's manager
  async updateEmployeeManager(employeeId, managerId) {
    const query =
      "UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING *";
    const result = await this.pool.query(query, [managerId, employeeId]);
    return result.rows[0];
  }

  // Update employee's department
  async updateEmployeeDepartment(employeeId, departmentId) {
    const query =
      "UPDATE employee SET department_id = $1 WHERE id = $2 RETURNING *";
    const result = await this.pool.query(query, [departmentId, employeeId]);
    return result.rows[0];
  }

  // Update employee's salary
  async updateEmployeeSalary(employeeId, salary) {
    const query = "UPDATE employee SET salary = $1 WHERE id = $2 RETURNING *";
    const result = await this.pool.query(query, [salary, employeeId]);
    return result.rows[0];
  }

  // Delete an employee
  async deleteEmployee(employeeId) {
    const query = "DELETE FROM employee WHERE id = $1 RETURNING *";
    const result = await this.pool.query(query, [employeeId]);
    return result.rows[0];
  }

  // Retrieve employees by manager
  async getEmployeesByManager(
    managerId,
    sortBy = "employee.id",
    order = "ASC"
  ) {
    const validSortColumns = {
      id: "employee.id",
      first_name: "employee.first_name",
      last_name: "employee.last_name",
      title: "role.title",
      department: "department.name",
      salary: "employee.salary",
    };

    const sortColumn = validSortColumns[sortBy] || "employee.id";
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, 
           employee.salary AS employee_salary, 
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    WHERE employee.manager_id = $1
    ORDER BY ${sortColumn} ${order}
  `;
    const result = await this.pool.query(query, [managerId]);
    return result.rows;
  }

  // Retrieve employees by department
  async getEmployeesByDepartment(
    departmentId,
    sortBy = "employee.id",
    order = "ASC"
  ) {
    const validSortColumns = {
      id: "employee.id",
      first_name: "employee.first_name",
      last_name: "employee.last_name",
      title: "role.title",
      department: "department.name",
      salary: "employee.salary",
    };

    const sortColumn = validSortColumns[sortBy] || "employee.id";
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, 
           employee.salary AS employee_salary, 
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    WHERE department.id = $1
    ORDER BY ${sortColumn} ${order}
  `;
    const result = await this.pool.query(query, [departmentId]);
    return result.rows;
  }

  // Display employees by manager
  async displayEmployeesByManager(
    managerId,
    sortBy = "employee.id",
    order = "ASC"
  ) {
    try {
      const employees = await this.getEmployeesByManager(
        managerId,
        sortBy,
        order
      );
      const formattedEmployees = employees.map((employee) => ({
        ID: employee.id,
        "First Name": employee.first_name,
        "Last Name": employee.last_name,
        Title: employee.title,
        Department: employee.department,
        "Employee Salary": new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(employee.employee_salary),
        Manager: employee.manager || "None",
      }));
      console.table(formattedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  }

  // Display employees by department
  async displayEmployeesByDepartment(
    departmentId,
    sortBy = "employee.id",
    order = "ASC"
  ) {
    try {
      const employees = await this.getEmployeesByDepartment(
        departmentId,
        sortBy,
        order
      );
      const formattedEmployees = employees.map((employee) => ({
        ID: employee.id,
        "First Name": employee.first_name,
        "Last Name": employee.last_name,
        Title: employee.title,
        Department: employee.department,
        "Employee Salary": new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(employee.employee_salary),
        Manager: employee.manager || "None",
      }));
      console.table(formattedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  }
}

module.exports = new Employee(pool);
