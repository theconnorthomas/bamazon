var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");
var clc = require("cli-color");
var Table = require("cli-table");

var table = new Table({
    head: ['ID', 'Products', "Department", "Price", "In Stock"]
    , colWidths: [5, 20, 20, 10, 10]
});

var products = [];
var product;

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your database name
    database: "bamazon"
});

figlet("BAMAZON!", function (err, data) {
    if (err) {
        console.log(clc.red('Something went wrong...'));
        console.dir(err);
        return;
    }
    console.log(data)
    console.log("Welcome Bamazon Manager!");
    console.log("Update inventory quantity below");
    console.log("==========================================================================");
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;

    displayInventory();
});

function displayInventory() {

    connection.query("SELECT * FROM inventory", function (err, results) {
        if (err) throw err;

        results.forEach(function (element) {
            products.push(element.id)
            table.push([element.ID, element.product_name, element.department, `$${element.price}`, element.quantity])
        });
        console.log(table.toString());

        editInventory();
    })
}

function editInventory() {
    inquirer
        .prompt([
            {
                name: "choice",
                type: "input",
                message: "Please enter the ID of the inventory item you wish to update?",
                validate: function (value) {
                    if (isNaN(value) || value > 10) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "And how many would you like add?",
                validate: function (value) {
                    if (isNaN(value) || value < 1) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        ])
        .then(function (answer) {

            checkInventory(answer.choice, answer.quantity);

        });
}

function checkInventory(choice, quantity) {
    connection.query("SELECT * FROM inventory WHERE ?", { ID: choice }, function (err, results) {
        var product = results;
        if (quantity > 500) {
            
            console.log(clc.red("\nInventory is already at max level!\n"))
            
            endConnection()
        } else {
            
            console.log("==========================================================================\n");
            
            confirmOrder(product, quantity);
        }
    })
}

function confirmOrder(product, quantity) {
    
    var updateQuantity = product[0].quantity + parseInt(quantity);

    inquirer.prompt({
        type: "confirm",
        name: "order",
        message: `You are adding ${quantity} ${product[0].product_name}(s), Confirm update?`
    })
        .then(function (answer) {
            if (answer.order) {
                connection.query("UPDATE inventory SET quantity = ? WHERE ID = ?", [updateQuantity, product[0].ID]);
                
                console.log("\n==========================================================================");
                console.log(clc.green("INVENTORY UPDATED!"));
                console.log("==========================================================================\n");
                
                keepManaging();
            } else {
                
                console.log("\n==========================================================================");
                console.log(clc.red("UPDATE CANCELLED"));
                console.log("==========================================================================\n");
                
                endConnection();
            }
        })
}
function keepManaging() {
    inquirer.prompt({
        type: "list",
        name: "keepManaging",
        message: `Would you like to modify additional inventory or exit inventory manager?`,
        choices: ["Modify additional inventory", "Exit inventory manger"]
    })
        .then(function (answer) {
            if (answer.keepManaging === "Modify additional inventory") {
                console.log("==========================================================================");
                editInventory();
            } else {
                console.log("==========================================================================");
                endConnection();
            }
        })
}

function endConnection() {

    connection.end(function (err) {
        console.log("Session ended.\n");
    })

}