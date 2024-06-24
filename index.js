// This file contains the main application logic, using the inquirer library to prompt the user for input and call the appropriate methods from the Employee, Role, and Department classes.

const inquirer = require("inquirer");
const employeeDB = require("./queries/employee");
const roleDB = require("./queries/role");
const departmentDB = require("./queries/department");

/**
 * Trims whitespace from user input.
 * @param {string} input - The user input to trim.
 * @returns {string} - The trimmed user input.
 */
function trimInput(input) {
  return input.trim();
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
 * Prompts user for sorting options.
 * @param {string} category - The category to sort.
 * @returns {Object} - The sorting options.
 */
async function promptSortOptions(category) {
  let sortChoices = ["id"];
  if (category === "Employees") {
    sortChoices = [
      "id",
      "first_name",
      "last_name",
      "title",
      "department",
      "salary",
    ];
  } else if (category === "Roles") {
    sortChoices = ["id", "title", "salary", "department"];
  } else if (category === "Departments") {
    sortChoices = ["id", "name"];
  }

  const { sortBy, order } = await inquirer.prompt([
    {
      type: "list",
      name: "sortBy",
      message: "Sort by:",
      choices: sortChoices,
    },
    {
      type: "list",
      name: "order",
      message: "Order:",
      choices: ["ASC", "DESC"],
    },
  ]);
  return { sortBy, order };
}

/**
 * Main function to start the application.
 */
async function startApp() {
  displayTitle(); // Display the title box

  try {
    const { actionGroup } = await inquirer.prompt([
      {
        type: "list",
        name: "actionGroup",
        message: "Select a category:",
        choices: [
          new inquirer.Separator("=== EMPLOYEES ==="),
          "View All Employees",
          "Add Employee",
          "Update Employee Info",
          "Delete Employee",
          new inquirer.Separator("=== ROLES ==="),
          "View All Roles",
          "Add Role",
          "Update Role Info",
          "Delete Role",
          new inquirer.Separator("=== DEPARTMENTS ==="),
          "View All Departments",
          "Add Department",
          "Update Department Info",
          "Delete Department",
          "View Department Budget",
          new inquirer.Separator(),
          "Exit",
        ],
      },
    ]);

    if (actionGroup === "View All Employees") {
      const { sortBy, order } = await promptSortOptions("Employees");
      await employeeDB.displayEmployees(sortBy, order);
    } else if (actionGroup === "Add Employee") {
      const roles = await roleDB.getRoles();
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      const employees = await employeeDB.getEmployees();
      const managerChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
      managerChoices.push({ name: "None", value: null });

      const { firstName, lastName, roleId, managerId, salary } =
        await inquirer.prompt([
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
          {
            type: "input",
            name: "salary",
            message: "Enter salary:",
            validate: (value) =>
              !isNaN(value) && value > 0 ? true : "Please enter a valid salary",
            filter: trimInput,
          },
        ]);

      await employeeDB.addEmployee(
        firstName,
        lastName,
        roleId,
        managerId,
        salary
      );
      console.log(`Added employee ${firstName} ${lastName} successfully.`);
    } else if (actionGroup === "Update Employee Info") {
      await employeeDB.displayEmployees();

      const employees = await employeeDB.getEmployees();
      const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));

      const { employeeId } = await inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select employee to update:",
          choices: employeeChoices,
        },
      ]);

      const { updateField } = await inquirer.prompt([
        {
          type: "list",
          name: "updateField",
          message: "Select the field to update:",
          choices: [
            "First Name",
            "Last Name",
            "Role",
            "Manager",
            "Department",
            "Salary",
            "Back",
          ],
        },
      ]);

      if (updateField === "Back") {
        startApp(); // Restart the application to go back to the main menu
        return;
      }

      if (updateField === "First Name" || updateField === "Last Name") {
        const { newValue } = await inquirer.prompt([
          {
            type: "input",
            name: "newValue",
            message: `Enter new ${updateField.toLowerCase()}:`,
            filter: trimInput,
          },
        ]);

        if (updateField === "First Name") {
          await employeeDB.updateEmployeeFirstName(employeeId, newValue);
        } else {
          await employeeDB.updateEmployeeLastName(employeeId, newValue);
        }

        console.log(`Updated ${updateField.toLowerCase()} successfully.`);
      } else if (updateField === "Role") {
        const roles = await roleDB.getRoles();
        const roleChoices = roles.map((role) => ({
          name: role.title,
          value: role.id,
        }));

        const { roleId } = await inquirer.prompt([
          {
            type: "list",
            name: "roleId",
            message: "Select new role:",
            choices: roleChoices,
          },
        ]);

        await employeeDB.updateEmployeeRole(employeeId, roleId);
        console.log(`Updated role successfully.`);
      } else if (updateField === "Manager") {
        const employees = await employeeDB.getEmployees();
        const managerChoices = employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));
        managerChoices.push({ name: "None", value: null });

        const { managerId } = await inquirer.prompt([
          {
            type: "list",
            name: "managerId",
            message: "Select new manager:",
            choices: managerChoices,
          },
        ]);

        await employeeDB.updateEmployeeManager(employeeId, managerId);
        console.log(`Updated manager successfully.`);
      } else if (updateField === "Department") {
        const departments = await departmentDB.getDepartments();
        const departmentChoices = departments.map((department) => ({
          name: department.name,
          value: department.id,
        }));

        const { departmentId } = await inquirer.prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Select new department:",
            choices: departmentChoices,
          },
        ]);

        await employeeDB.updateEmployeeDepartment(employeeId, departmentId);
        console.log(`Updated department successfully.`);
      } else if (updateField === "Salary") {
        const { salary } = await inquirer.prompt([
          {
            type: "input",
            name: "salary",
            message: "Enter new salary:",
            validate: (value) =>
              !isNaN(value) && value > 0 ? true : "Please enter a valid salary",
            filter: trimInput,
          },
        ]);

        await employeeDB.updateEmployeeSalary(employeeId, salary);
        console.log(`Updated salary successfully.`);
      }
    } else if (actionGroup === "Delete Employee") {
      await employeeDB.displayEmployees();

      const employees = await employeeDB.getEmployees();
      const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));

      const { employeeId } = await inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select employee to delete:",
          choices: employeeChoices,
        },
      ]);

      const { confirmDelete } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmDelete",
          message: "Are you sure you want to delete this employee?",
        },
      ]);

      if (confirmDelete) {
        await employeeDB.deleteEmployee(employeeId);
        console.log(`Deleted employee successfully.`);
      }
    } else if (actionGroup === "View All Roles") {
      const { sortBy, order } = await promptSortOptions("Roles");
      await roleDB.displayRoles(sortBy, order);
    } else if (actionGroup === "Add Role") {
      const departments = await departmentDB.getDepartments();
      const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
      }));

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

      await roleDB.addRole(title, salary, departmentId);
      console.log(`Added role ${title} successfully.`);
    } else if (actionGroup === "Update Role Info") {
      await roleDB.displayRoles();

      const roles = await roleDB.getRoles();
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      const { roleId } = await inquirer.prompt([
        {
          type: "list",
          name: "roleId",
          message: "Select role to update:",
          choices: roleChoices,
        },
      ]);

      const { updateField } = await inquirer.prompt([
        {
          type: "list",
          name: "updateField",
          message: "Select the field to update:",
          choices: ["Title", "Salary", "Department", "Back"],
        },
      ]);

      if (updateField === "Back") {
        startApp(); // Restart the application to go back to the main menu
        return;
      }

      if (updateField === "Title" || updateField === "Salary") {
        const { newValue } = await inquirer.prompt([
          {
            type: "input",
            name: "newValue",
            message: `Enter new ${updateField.toLowerCase()}:`,
            filter: trimInput,
          },
        ]);

        if (updateField === "Title") {
          await roleDB.updateRoleTitle(roleId, newValue);
        } else {
          await roleDB.updateRoleSalary(roleId, newValue);
        }

        console.log(`Updated ${updateField.toLowerCase()} successfully.`);
      } else if (updateField === "Department") {
        const departments = await departmentDB.getDepartments();
        const departmentChoices = departments.map((department) => ({
          name: department.name,
          value: department.id,
        }));

        const { departmentId } = await inquirer.prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Select new department:",
            choices: departmentChoices,
          },
        ]);

        await roleDB.updateRoleDepartment(roleId, departmentId);
        console.log(`Updated department successfully.`);
      }
    } else if (actionGroup === "Delete Role") {
      await roleDB.displayRoles();

      const roles = await roleDB.getRoles();
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      const { roleId } = await inquirer.prompt([
        {
          type: "list",
          name: "roleId",
          message: "Select role to delete:",
          choices: roleChoices,
        },
      ]);

      const { confirmDelete } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmDelete",
          message: "Are you sure you want to delete this role?",
        },
      ]);

      if (confirmDelete) {
        await roleDB.deleteRole(roleId);
        console.log(`Deleted role successfully.`);
      }
    } else if (actionGroup === "View All Departments") {
      const { sortBy, order } = await promptSortOptions("Departments");
      await departmentDB.displayDepartments(sortBy, order);
    } else if (actionGroup === "Add Department") {
      const { departmentName } = await inquirer.prompt([
        {
          type: "input",
          name: "departmentName",
          message: "Enter department name:",
          filter: trimInput,
        },
      ]);

      await departmentDB.addDepartment(departmentName);
      console.log(`Added department ${departmentName} successfully.`);
    } else if (actionGroup === "Update Department Info") {
      await departmentDB.displayDepartments();

      const departments = await departmentDB.getDepartments();
      const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
      }));

      const { departmentId } = await inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select department to update:",
          choices: departmentChoices,
        },
      ]);

      const { updateField } = await inquirer.prompt([
        {
          type: "list",
          name: "updateField",
          message: "Select the field to update:",
          choices: ["Name", "Back"],
        },
      ]);

      if (updateField === "Back") {
        startApp(); // Restart the application to go back to the main menu
        return;
      }

      if (updateField === "Name") {
        const { newValue } = await inquirer.prompt([
          {
            type: "input",
            name: "newValue",
            message: `Enter new ${updateField.toLowerCase()}:`,
            filter: trimInput,
          },
        ]);

        await departmentDB.updateDepartmentName(departmentId, newValue);
        console.log(`Updated ${updateField.toLowerCase()} successfully.`);
      }
    } else if (actionGroup === "Delete Department") {
      await departmentDB.displayDepartments();

      const departments = await departmentDB.getDepartments();
      const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
      }));

      const { departmentId } = await inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select department to delete:",
          choices: departmentChoices,
        },
      ]);

      const { confirmDelete } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmDelete",
          message: "Are you sure you want to delete this department?",
        },
      ]);

      if (confirmDelete) {
        await departmentDB.deleteDepartment(departmentId);
        console.log(`Deleted department successfully.`);
      }
    } else if (actionGroup === "View Department Budget") {
      const departments = await departmentDB.getDepartments();
      const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
      }));

      const { departmentId } = await inquirer.prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select department to view budget:",
          choices: departmentChoices,
        },
      ]);

      const totalBudget = await departmentDB.getDepartmentBudget(departmentId);
      const formattedBudget = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(totalBudget);
      console.log(`Total Utilized Budget of Department: ${formattedBudget}`);
    }

    await inquirer.prompt([
      {
        type: "input",
        name: "enter",
        message: "Press Enter to continue...",
      },
    ]);

    if (actionGroup !== "Exit") {
      startApp();
    }
  } catch (err) {
    console.error("Error starting application:", err.message);
  }
}

startApp();
