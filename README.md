# 12-SQL: Employee Tracker

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Schema](#schema)
6. [Walkthrough Video](#walkthrough-video)
7. [Technologies Used](#technologies-used)
8. [Contributing](#contributing)
9. [License](#license)

---

## Overview
Employee Tracker is a command-line application designed to manage a company's employee database. Built using Node.js, Inquirer, and PostgreSQL, this application provides a user-friendly interface for business owners to view and manage departments, roles, and employees within their organization.

[Back to Table of Contents](#table-of-contents)

---

## Features
- **View Departments**: Display a list of all departments with their respective IDs.
- **View Roles**: Display a list of all roles with their IDs, titles, associated department names, and salaries.
- **View Employees**: Display a formatted table of employee data, including IDs, first and last names, job titles, departments, salaries, and managers.
- **Add Department**: Prompt the user to enter a department name and add it to the database.
- **Add Role**: Prompt the user to enter the title, salary, and department for a role, then add it to the database.
- **Add Employee**: Prompt the user to enter the first name, last name, role, and manager for a new employee, then add the employee to the database.
- **Update Employee Role**: Prompt the user to select an employee and update their role in the database.

[Back to Table of Contents](#table-of-contents)

---

## Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd employee-tracker
   ```

2. **Set up environment variables**:
   - Create a `.env` file in the root directory with the following content:
     ```env
     DB_USER=yourusername
     DB_PASSWORD=yourpassword
     DB_HOST=localhost
     DB_PORT=5432
     DB_DATABASE=employee_tracker
     ```
   Replace `yourusername` and `yourpassword` with your PostgreSQL credentials.

3. **Initialize the database**:
   ```bash
   psql -U yourusername -f sql/initialize_employee_tracker_db.sql
   ```

4. **Seed the database**:
   ```bash
   psql -U yourusername -f sql/seeds.sql
   ```

5. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

6. **Run the application**:
   ```bash
   node index.js
   ```

[Back to Table of Contents](#table-of-contents)

---

## Usage
1. **Start the application** by running `node index.js` in the terminal.
2. **Select an option** from the menu using the arrow keys and press Enter.
3. **Follow the prompts** to view or manage the database.
4. **Exit the application** by selecting the "Exit" option from the menu.

[Back to Table of Contents](#table-of-contents)

---

## Schema
The database schema consists of three tables:

- **Department Table**:
  - `id`: Primary key, auto-incremented.
  - `name`: Name of the department (unique and not null).

- **Role Table**:
  - `id`: Primary key, auto-incremented.
  - `title`: Title of the role (unique and not null).
  - `salary`: Salary for the role (not null).
  - `department_id`: Foreign key referencing the `department` table.

- **Employee Table**:
  - `id`: Primary key, auto-incremented.
  - `first_name`: Employee's first name (not null).
  - `last_name`: Employee's last name (not null).
  - `role_id`: Foreign key referencing the `role` table.
  - `manager_id`: Foreign key referencing the `employee` table (self-referential).

[Back to Table of Contents](#table-of-contents)

---

## Walkthrough Video
[Link to walkthrough video](#) demonstrating the functionality of the Employee Tracker application.

[Back to Table of Contents](#table-of-contents)

---

## Technologies Used
- Node.js
- Inquirer.js
- PostgreSQL
- pg (node-postgres)

[Back to Table of Contents](#table-of-contents)

---

## Contributing
1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a pull request**.

[Back to Table of Contents](#table-of-contents)

---

## License
This project is licensed under the MIT License.

[Back to Table of Contents](#table-of-contents)