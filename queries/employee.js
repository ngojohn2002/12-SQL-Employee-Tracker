const pool = require("../db/connection"); // Import the database connection

class Employee {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Fetches all employees from the database.
   * @returns {Promise<Array>} - A promise that resolves to an array of employees.
   */
  async getEmployees() {
    const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Displays all employees in a formatted table.
   */
  async displayEmployees() {
    try {
      const employees = await this.getEmployees(); // Fetch all employees

      const formattedEmployees = employees.map((employee) => ({
        ID: employee.id,
        "First Name": employee.first_name,
        "Last Name": employee.last_name,
        Title: employee.title,
        Department: employee.department,
        Salary: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(employee.salary), // Format salary as currency
        Manager: employee.manager_first_name
          ? `${employee.manager_first_name} ${employee.manager_last_name}`
          : "null", // Display "null" for no manager
      }));

      console.table(formattedEmployees); // Display employees in a formatted table
    } catch (error) {
      console.error("Error fetching employees:", error.message); // Log error message
    }
  }

  /**
   * Adds a new employee to the database.
   * @param {string} firstName - The first name of the employee.
   * @param {string} lastName - The last name of the employee.
   * @param {number} roleId - The role ID of the employee.
   * @param {number|null} managerId - The manager ID of the employee, or null if none.
   */
  async addEmployee(firstName, lastName, roleId, managerId) {
    const query = `
      INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [firstName, lastName, roleId, managerId];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Updates an employee's role in the database.
   * @param {number} employeeId - The ID of the employee.
   * @param {number} roleId - The new role ID of the employee.
   */
  async updateEmployeeRole(employeeId, roleId) {
    const query = `
      UPDATE employee
      SET role_id = $1
      WHERE id = $2
      RETURNING *
    `;
    const values = [roleId, employeeId];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Updates an employee's manager in the database.
   * @param {number} employeeId - The ID of the employee.
   * @param {number} managerId - The new manager ID of the employee.
   */
  async updateEmployeeManager(employeeId, managerId) {
    const query = `
      UPDATE employee
      SET manager_id = $1
      WHERE id = $2
      RETURNING *
    `;
    const values = [managerId, employeeId];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Fetches employees by manager.
   * @param {number} managerId - The manager ID to filter employees.
   * @returns {Promise<Array>} - A promise that resolves to an array of employees managed by the given manager.
   */
  async getEmployeesByManager(managerId) {
    const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      WHERE employee.manager_id = $1
    `;
    const result = await this.pool.query(query, [managerId]);
    return result.rows;
  }

  /**
   * Fetches employees by department.
   * @param {number} departmentId - The department ID to filter employees.
   * @returns {Promise<Array>} - A promise that resolves to an array of employees in the given department.
   */
  async getEmployeesByDepartment(departmentId) {
    const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN employee AS manager ON employee.manager_id = manager.id
      WHERE role.department_id = $1
    `;
    const result = await this.pool.query(query, [departmentId]);
    return result.rows;
  }

  /**
   * Deletes an employee from the database.
   * @param {number} employeeId - The ID of the employee to delete.
   */
  async deleteEmployee(employeeId) {
    const query = `
      DELETE FROM employee
      WHERE id = $1
      RETURNING *
    `;
    const result = await this.pool.query(query, [employeeId]);
    return result.rows[0];
  }
}

module.exports = new Employee(pool);
