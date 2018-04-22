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
var subTotal;
var salesTax;
var total;

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
    console.log("Welcome to Bamazon!");
    console.log("Check out or products below");
    console.log("==========================================================================");
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;

    shop();
});

function shop() {

    connection.query("SELECT * FROM inventory", function (err, results) {
        if (err) throw err;

        results.forEach(function (element) {
            products.push(element.id)
            table.push([element.ID, element.product_name, element.department, `$${element.price}`, element.quantity])
        });
        console.log(table.toString());

        buyItem();
    })
}

function buyItem() {
    inquirer
        .prompt([
            {
                name: "choice",
                type: "input",
                message: "Please enter the ID of the item you wish to purchase?",
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
                message: "And how many would you like buy?",
                validate: function (value) {
                    if (isNaN(value) || value > 10) {
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
        if (results[0].quantity < quantity) {
            
            console.log(clc.red("\nInsufficient stocks is available to fulfill your request!\n"))
            
            endConnection()
        } else {
            subTotal = parseInt(quantity) * product[0].price;
            
            console.log("\n==========================================================================");
            console.log(`You ordered ${quantity} ${product[0].product_name}(s).`)
            console.log(`Your subtotal is: ${subTotal}`);
            console.log("==========================================================================\n");
            
            confirmOrder(product, quantity);
        }
    })
}

function confirmOrder(product, quantity) {

    salesTax = 1.0825
    total = (subTotal * salesTax).toFixed(2);
    
    var updateQuantity = product[0].quantity - parseInt(quantity);

    inquirer.prompt({
        type: "confirm",
        name: "order",
        message: `After tax, your total is $${total}, Confirm order?`
    })
        .then(function (answer) {
            if (answer.order) {
                connection.query("UPDATE inventory SET quantity = ? WHERE ID = ?", [updateQuantity, product[0].ID]);

                console.log("\n==========================================================================");
                console.log(clc.green("ORDER CONFIRMED!"));
                console.log("==========================================================================\n");

                keepShopping();
            } else {
                console.log("\n==========================================================================");
                console.log(clc.green("ORDER CANCELLED!"));
                console.log("==========================================================================\n");
               
                endConnection();
            }
        })
}
function keepShopping(){
inquirer.prompt({
    type: "list",
    name: "keepShopping",
    message: `Would you like you keep shopping or checkout?`,
    choices: ["Keep Shopping", "Checkout"]
})
    .then(function (answer) {
        if (answer.keepShopping === "Keep Shopping") {
            console.log("==========================================================================");
            buyItem();
        } else {
            console.log("==========================================================================");
            endConnection();
        }
    })
}

function endConnection() {

    connection.end(function (err) {
        console.log("Come back soon!\n");
    })

}