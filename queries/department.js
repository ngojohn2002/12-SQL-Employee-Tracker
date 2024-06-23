const pool = require("../db/connection"); // Import the database connection

class Department {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Fetches all departments from the database.
   * @returns {Promise<Array>} - A promise that resolves to an array of departments.
   */
  async getDepartments() {
    const query = `
      SELECT id, name
      FROM department
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Displays all departments in a formatted table.
   */
  async displayDepartments() {
    try {
      const departments = await this.getDepartments(); // Fetch all departments

      const formattedDepartments = departments.map((department) => ({
        ID: department.id,
        Name: department.name,
      }));

      console.table(formattedDepartments); // Display departments in a formatted table
    } catch (error) {
      console.error("Error fetching departments:", error.message); // Log error message
    }
  }

  /**
   * Adds a new department to the database.
   * @param {string} name - The name of the department.
   */
  async addDepartment(name) {
    const query = `
      INSERT INTO department (name)
      VALUES ($1)
      RETURNING *
    `;
    const result = await this.pool.query(query, [name]);
    return result.rows[0];
  }

  /**
   * Deletes a department from the database.
   * @param {number} departmentId - The ID of the department to delete.
   */
  async deleteDepartment(departmentId) {
    const query = `
      DELETE FROM department
      WHERE id = $1
      RETURNING *
    `;
    const result = await this.pool.query(query, [departmentId]);
    return result.rows[0];
  }

  /**
   * Fetches the total utilized budget of a department.
   * @param {number} departmentId - The ID of the department.
   * @returns {Promise<number>} - A promise that resolves to the total utilized budget of the department.
   */
  async getDepartmentBudget(departmentId) {
    const query = `
      SELECT SUM(role.salary) AS total_budget
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      WHERE role.department_id = $1
    `;
    const result = await this.pool.query(query, [departmentId]);
    return result.rows[0].total_budget;
  }
}

module.exports = new Department(pool);
