const pool = require("../db/connection");

class Department {
  constructor(pool) {
    this.pool = pool;
  }

  // Retrieve all departments with sorting options
  async getDepartments(sortBy = "id", order = "ASC") {
    const validSortColumns = {
      id: "id",
      name: "name",
    };

    const sortColumn = validSortColumns[sortBy] || "id";
    const query = `SELECT id, name FROM department ORDER BY ${sortColumn} ${order}`;
    const result = await this.pool.query(query);
    return result.rows;
  }

  // Display all departments
  async displayDepartments(sortBy = "id", order = "ASC") {
    try {
      const departments = await this.getDepartments(sortBy, order);
      const formattedDepartments = departments.map((department) => ({
        ID: department.id,
        Name: department.name,
      }));
      console.table(formattedDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error.message);
    }
  }

  // Add a new department
  async addDepartment(name) {
    const query = "INSERT INTO department (name) VALUES ($1) RETURNING *";
    const result = await this.pool.query(query, [name]);
    return result.rows[0];
  }

  // Update department name
  async updateDepartmentName(departmentId, name) {
    const query = "UPDATE department SET name = $1 WHERE id = $2 RETURNING *";
    const result = await this.pool.query(query, [name, departmentId]);
    return result.rows[0];
  }

  // Delete a department
  async deleteDepartment(departmentId) {
    const query = "DELETE FROM department WHERE id = $1 RETURNING *";
    const result = await this.pool.query(query, [departmentId]);
    return result.rows[0];
  }

  // Get the total budget for a department
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
