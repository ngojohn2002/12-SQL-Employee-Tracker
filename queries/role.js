const pool = require("../db/connection"); // Import the database connection

class Role {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Fetches all roles from the database.
   * @returns {Promise<Array>} - A promise that resolves to an array of roles.
   */
  async getRoles() {
    const query = `
      SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      LEFT JOIN department ON role.department_id = department.id
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Displays all roles in a formatted table.
   */
  async displayRoles() {
    try {
      const roles = await this.getRoles(); // Fetch all roles

      const formattedRoles = roles.map((role) => ({
        ID: role.id,
        Title: role.title,
        Salary: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(role.salary), // Format salary as currency
        Department: role.department,
      }));

      console.table(formattedRoles); // Display roles in a formatted table
    } catch (error) {
      console.error("Error fetching roles:", error.message); // Log error message
    }
  }

  /**
   * Adds a new role to the database.
   * @param {string} title - The title of the role.
   * @param {number} salary - The salary of the role.
   * @param {number} departmentId - The department ID the role belongs to.
   */
  async addRole(title, salary, departmentId) {
    const query = `
      INSERT INTO role (title, salary, department_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [title, salary, departmentId];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Deletes a role from the database.
   * @param {number} roleId - The ID of the role to delete.
   */
  async deleteRole(roleId) {
    const query = `
      DELETE FROM role
      WHERE id = $1
      RETURNING *
    `;
    const result = await this.pool.query(query, [roleId]);
    return result.rows[0];
  }
}

module.exports = new Role(pool);
