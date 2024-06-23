const inquirer = require("inquirer"); // Import inquirer for CLI prompts
const employeeDB = require("./queries/employee"); // Import the Employee class instance
const roleDB = require("./queries/role"); // Import the Role class instance
const departmentDB = require("./queries/department"); // Import the Department class instance

/**
 * Trims whitespace from user input.
 * @param {string} input - The user input to trim.
 * @returns {string} - The trimmed user input.
 */
function trimInput(input) {
  return input.trim(); // Trim leading and trailing whitespace
}

/**
 * Displays a title box at the start of the program.
 */
function displayTitle() {
  console.log(`
╔═════════════════════════════════════════════════════════════════════════════╗
║                                                                             ║
║    ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗    ║
║    ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝    ║
║    █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗      ║
║    ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝      ║
║    ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗    ║
║    ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝    ║
║                                                                             ║
║          ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗           ║
║          ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗          ║
║             ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝          ║
║             ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗          ║
║             ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║          ║
║             ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝          ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
  `); // Display the title in a formatted box
}

/**
 * Prompts user to select an option from a list of choices.
 * @param {string} message - The message to display in the prompt.
 * @param {Array} choices - The list of choices to present to the user.
 * @returns {string} - The selected option.
 */
async function promptList(message, choices) {
  const { selected } = await inquirer.prompt([
    {
      type: "list",
      name: "selected",
      message,
      choices,
    },
  ]);
  return selected; // Return the selected option
}

/**
 * Main function to start the application.
 */
async function startApp() {
  displayTitle(); // Display the title box
  try {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View All Employees", // Option to view all employees
          "Add Employee", // Option to add a new employee
          "Update Employee Role", // Option to update an employee's role
          "Update Employee Manager", // Option to update an employee's manager
          "View Employees by Manager", // Option to view employees by manager
          "View Employees by Department", // Option to view employees by department
          "View All Roles", // Option to view all roles
          "Add Role", // Option to add a new role
          "Delete Role", // Option to delete a role
          "View All Departments", // Option to view all departments
          "Add Department", // Option to add a new department
          "Delete Department", // Option to delete a department
          "View Department Budget", // Option to view the total utilized budget of a department
          "Exit", // Option to exit the application
        ],
      },
    ]);

    if (action === "View All Employees") {
      await employeeDB.displayEmployees(); // Display all employees
    } else if (action === "Add Employee") {
      const roles = await roleDB.getRoles(); // Fetch all roles
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      })); // Format role choices for inquirer prompt
      const employees = await employeeDB.getEmployees(); // Fetch all employees
      const managerChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
      managerChoices.push({ name: "None", value: null }); // Add 'None' option for manager

      const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter first name:",
          filter: trimInput,
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter last name:",
          filter: trimInput,
        },
        {
          type: "list",
          name: "roleId",
          message: "Select role:",
          choices: roleChoices,
        },
        {
          type: "list",
          name: "managerId",
          message: "Select manager:",
          choices: managerChoices,
        },
      ]);

      await employeeDB.addEmployee(firstName, lastName, roleId, managerId); // Add the new employee to the database
    } else if (action === "Update Employee Role") {
      const employees = await employeeDB.getEmployees(); // Fetch all employees
      const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })); // Format employee choices for inquirer prompt
      const roles = await roleDB.getRoles(); // Fetch all roles
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      })); // Format role choices for inquirer prompt

      const { employeeId, roleId } = await inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select employee to update:",
          choices: employeeChoices,
        },
        {
          type: "list",
          name: "roleId",
          message: "Select new role:",
          choices: roleChoices,
        },
      ]);

      await employeeDB.updateEmployeeRole(employeeId, roleId); // Update employee role in the database
    } else if (action === "Update Employee Manager") {
      const employees = await employeeDB.getEmployees(); // Fetch all employees
      const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })); // Format employee choices for inquirer prompt

      const { employeeId, managerId } = await inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select employee to update:",
          choices: employeeChoices,
        },
        {
          type: "list",
          name: "managerId",
          message: "Select new manager:",
          choices: employeeChoices,
        },
      ]);

      await employeeDB.updateEmployeeManager(employeeId, managerId); // Update employee manager in the database
    } else if (action === "View Employees by Manager") {
      const managers = await employeeDB.getEmployees(); // Fetch all managers
      const managerChoices = managers.map((manager) => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id,
      })); // Format manager choices for inquirer prompt

      const { managerId } = await inquirer.prompt([
        {
          type: "list",
          name: "managerId",
          message: "Select manager:",
          choices: managerChoices,
        },
      ]);

      const employees = await employeeDB.getEmployeesByManager(managerId); // Fetch employees by manager
      console.table(employees);
    } else if (action === "View Employees by Department") {
      const departments = await departmentDB.getDepartments(); // Fetch all departments
      const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
      })); // Format department choices for inquirer prompt

      const { departmentId } = await inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select department:",
          choices: departmentChoices,
        },
      ]);

      const employees = await employeeDB.getEmployeesByDepartment(departmentId); // Fetch employees by department
      console.table(employees);
    } else if (action === "View All Roles") {
      await roleDB.displayRoles(); // Display all roles
    } else if (action === "Add Role") {
      const departments = await departmentDB.getDepartments(); // Fetch all departments
      const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
      })); // Format department choices for inquirer prompt

      const { title, salary, departmentId } = await inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "Enter role title:",
          filter: trimInput,
        },
        {
          type: "input",
          name: "salary",
          message: "Enter role salary:",
          validate: (value) =>
            !isNaN(value) && value > 0 ? true : "Please enter a valid salary",
          filter: trimInput,
        },
        {
          type: "list",
          name: "departmentId",
          message: "Select department:",
          choices: departmentChoices,
        },
      ]);

      await roleDB.addRole(title, salary, departmentId); // Add new role to the database
    } else if (action === "Delete Role") {
      const roles = await roleDB.getRoles(); // Fetch all roles
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      })); // Format role choices for inquirer prompt

      const { roleId } = await inquirer.prompt([
        {
          type: "list",
          name: "roleId",
          message: "Select role to delete:",
          choices: roleChoices,
        },
      ]);

      await roleDB.deleteRole(roleId); // Delete role from the database
    } else if (action === "View All Departments") {
      await departmentDB.displayDepartments(); // Display all departments
    } else if (action === "Add Department") {
      const { departmentName } = await inquirer.prompt([
        {
          type: "input",
          name: "departmentName",
          message: "Enter department name:",
          filter: trimInput,
        },
      ]);

      await departmentDB.addDepartment(departmentName); // Add new department to the database
    } else if (action === "Delete Department") {
      const departments = await departmentDB.getDepartments(); // Fetch all departments
      const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
      })); // Format department choices for inquirer prompt

      const { departmentId } = await inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select department to delete:",
          choices: departmentChoices,
        },
      ]);

      await departmentDB.deleteDepartment(departmentId); // Delete department from the database
    } else if (action === "View Department Budget") {
      const departments = await departmentDB.getDepartments(); // Fetch all departments
      const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
      })); // Format department choices for inquirer prompt

      const { departmentId } = await inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select department to view budget:",
          choices: departmentChoices,
        },
      ]);

      const totalBudget = await departmentDB.getDepartmentBudget(departmentId); // Fetch the total utilized budget of the department
      console.log(`Total Utilized Budget of Department: $${totalBudget}`);
    }

    if (action !== "Exit") {
      startApp(); // Restart the application if not exiting
    }
  } catch (err) {
    console.error("Error starting application:", err.message); // Log error message
  }
}

startApp(); // Start the application
