const readline = require("readline");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// In-memory employee list
let employees = [];

// Show menu options
function showMenu() {
  console.log(`
===========================
 Employee Management System
===========================
1. Add Employee
2. List Employees
3. Remove Employee
4. Exit
  `);

  rl.question("Choose an option: ", (choice) => {
    switch (choice) {
      case "1":
        addEmployee();
        break;
      case "2":
        listEmployees();
        break;
      case "3":
        removeEmployee();
        break;
      case "4":
        console.log("Exiting program. Goodbye!");
        rl.close();
        break;
      default:
        console.log("Invalid option. Please try again.");
        showMenu();
    }
  });
}

// Add employee
function addEmployee() {
  rl.question("Enter Employee ID: ", (id) => {
    rl.question("Enter Employee Name: ", (name) => {
      employees.push({ id, name });
      console.log(`Employee ${name} (ID: ${id}) added successfully.`);
      showMenu();
    });
  });
}

// List employees
function listEmployees() {
  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    console.log("\nCurrent Employees:");
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. ID: ${emp.id}, Name: ${emp.name}`);
    });
  }
  showMenu();
}

// Remove employee
function removeEmployee() {
  rl.question("Enter Employee ID to remove: ", (id) => {
    const index = employees.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      console.log(`Employee ${employees[index].name} (ID: ${id}) removed.`);
      employees.splice(index, 1);
    } else {
      console.log("Employee not found.");
    }
    showMenu();
  });
}

// Start program
showMenu();
