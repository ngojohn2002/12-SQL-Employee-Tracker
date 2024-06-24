// This file defines the Role class with methods for CRUD operations and other queries on the role table.

const pool = require("../db/connection");

class Role {
  constructor(pool) {
    this.pool = pool;
  }

  // Retrieve all roles with sorting options
  async getRoles(sortBy = "role.id", order = "ASC") {
    const validSortColumns = {
      id: "role.id",
      title: "role.title",
      salary: "role.salary",
      department: "department.name",
    };

    const sortColumn = validSortColumns[sortBy] || "role.id";
    const query = `
      SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      LEFT JOIN department ON role.department_id = department.id
      ORDER BY ${sortColumn} ${order}
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  // Display all roles
  async displayRoles(sortBy = "role.id", order = "ASC") {
    try {
      const roles = await this.getRoles(sortBy, order);
      const formattedRoles = roles.map((role) => ({
        ID: role.id,
        Title: role.title,
        Salary: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(role.salary),
        Department: role.department,
      }));
      console.table(formattedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error.message);
    }
  }

  // Add a new role
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

  // Update role title
  async updateRoleTitle(roleId, title) {
    const query = "UPDATE role SET title = $1 WHERE id = $2 RETURNING *";
    const result = await this.pool.query(query, [title, roleId]);
    return result.rows[0];
  }

  // Update role salary
  async updateRoleSalary(roleId, salary) {
    const query = "UPDATE role SET salary = $1 WHERE id = $2 RETURNING *";
    const result = await this.pool.query(query, [salary, roleId]);
    return result.rows[0];
  }

  // Update role department
  async updateRoleDepartment(roleId, departmentId) {
    const query =
      "UPDATE role SET department_id = $1 WHERE id = $2 RETURNING *";
    const result = await this.pool.query(query, [departmentId, roleId]);
    return result.rows[0];
  }

  // Delete a role
  async deleteRole(roleId) {
    const query = "DELETE FROM role WHERE id = $1 RETURNING *";
    const result = await this.pool.query(query, [roleId]);
    return result.rows[0];
  }
}

module.exports = new Role(pool);
