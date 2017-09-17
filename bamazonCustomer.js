var inquirer = require("inquirer");
var table = require('easy-table');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'mju78ik,',
    database: 'bamazon'
});

displayProductsAndTakeOrder();

function displayProductsAndTakeOrder() {
    var t = new table;

    // Display all products in inventory
    var allItemsQuery = 'SELECT * FROM products';
    connection.query(allItemsQuery, function (err, results) {
        if (err) throw err;
        console.log("AVAILABLE ITEMS\n" +
            "================");
        for (var i = 0; i < results.length; i++) {
            t.cell('Product Id', results[i].item_id);
            t.cell('Name', results[i].product_name);
            t.cell('Price, USD', results[i].price, table.number(2));
            t.newRow();
        }
        console.log(t.toString() + "\n========================");
        // call the function to take an order
        takeOrder();
    });
}


function takeOrder() {
    // Take an order by prompting for its ID and quantity to buy
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the id of the item you would like to purchase:",
            name: "id",
            validate: function (num) {
                return (!isNaN(num) && num > 0)
            }
        },
        {
            type: "input",
            message: "Enter the quantity you would like to purchase:",
            name: "qty",
            validate: function (num) {
                return (!isNaN(num) && num > 0)
            }
        }
    ]).then(function (inquirerResponse) {
        checkOrder(inquirerResponse);
    });
}


function checkOrder(response) {
    // check the order to make sure it's valid and there is enough quantity
    var itemQuery = 'SELECT * FROM products WHERE ?';

    connection.query(itemQuery, {item_id: response.id}, function (err, results) {
        if (err) throw err;
        if (results.length === 0) {
            console.log(response.id + " is not a valid item id. Please try again.\n========================");
            displayProductsAndTakeOrder();
        }
        else if (results[0].stock_quantity >= response.qty) {
            // we are good. Process the order
            processOrder(response.id, results[0].stock_quantity, response.qty, results[0].price);
        }
        else {
            console.log("We don't have sufficient quantity in stock to process your order at this time. Please try a lower quantity or a different item.\n========================");
            displayProductsAndTakeOrder();
        }
    });

}


function processOrder(item_id, stock_qty, order_qty, item_price) {
    // Process the order. Update the quantity in the DB and show the user the total cost.
    var qtyUpdateQuery = 'UPDATE products SET ? WHERE ?';

    connection.query(qtyUpdateQuery, [{stock_quantity: stock_qty - order_qty}, {item_id: item_id}], function (err, results) {
        if (err) throw err;
        console.log("Your order has been processed. Your account was charged $" + (order_qty * item_price).toFixed(2));
        inquirer.prompt([
            {
                type: "confirm",
                name: "keepOrdering",
                message: "Would you like to place another order?",
                default: false
            }
        ]).then(function (answers) {
            if (answers.keepOrdering) {
                displayProductsAndTakeOrder();
            }
            else {
                console.log("Thank you. Come back again soon.")
                connection.end();
            }
        });
    });
}
