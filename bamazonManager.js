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


var options = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"];
getOption();

function getOption() {
    // show the options for the actions the manager can perform and let the user select one.
    inquirer.prompt([
        {
            type: "list",
            message: "Choose an option",
            choices: options,
            name: "option"
        }
    ]).then(function (inquirerResponse) {
        switch (inquirerResponse.option) {
            case options[0]:
                displayAllProducts();
                break;
            case options[1]:
                viewLowInventory();
                break;
            case options[2]:
                addToIventory();
                break;
            case options[3]:
                addNewProduct();
                break;
            case options[4]:
                console.log("Goodbye!");
                connection.end();
                break;
            default:
                break;
        }
    });
}


function displayAllProducts() {
    // display a list of all the products
    var t = new table;

    var allItemsQuery = 'SELECT * FROM products';
    connection.query(allItemsQuery, function (err, results) {
        if (err) throw err;
        console.log("ALL AVAILABLE ITEMS\n" +
            "================");
        for (var i = 0; i < results.length; i++) {
            t.cell('Product Id', results[i].item_id);
            t.cell('Name', results[i].product_name);
            t.cell('Department', results[i].department_name);
            t.cell('Price, USD', results[i].price, table.number(2));
            t.cell('Quantity', results[i].stock_quantity);
            t.newRow();
        }
        console.log(t.toString() + "\n========================");
        getOption();
    });
}

function viewLowInventory() {
    // display items with stock quantity < 5
    var t = new table;

    var lowInventoryQuery = 'SELECT * FROM products WHERE stock_quantity < 5';
    connection.query(lowInventoryQuery, function (err, results) {
        if (err) throw err;
        console.log("ITEMS WITH INVENTORY LOWER THAN FIVE\n" +
            "================");
        for (var i = 0; i < results.length; i++) {
            t.cell('Product Id', results[i].item_id);
            t.cell('Name', results[i].product_name);
            t.cell('Department', results[i].department_name);
            t.cell('Price, USD', results[i].price, table.number(2));
            t.cell('Quantity', results[i].stock_quantity);
            t.newRow();
        }
        console.log(t.toString() + "\n========================");
        getOption();
    });
}

function addToIventory() {
    // Let manager add more of an item by entering the item id and quantity to add
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the id of the item to add more of:",
            name: "id",
            validate: function (num) {
                return (!isNaN(num) && num > 0)
            }
        },
        {
            type: "input",
            message: "Enter the quantity to add:",
            name: "qty",
            validate: function (num) {
                return (!isNaN(num) && num > 0)
            }
        }
    ]).then(function (inquirerResponse) {
        checkItem(inquirerResponse);
    });
}


function checkItem(response) {
    // check the item to add to make sure it's valid
    var itemQuery = 'SELECT * FROM products WHERE ?';

    connection.query(itemQuery, {item_id: response.id}, function (err, results) {
        if (err) throw err;
        if (results.length === 0) {
            console.log(response.id + " is not a valid item id. Please try again.\n========================");
            getOption();
        }
        else {
            // we are good. Add the item
            addQty(response.id, results[0].stock_quantity, response.qty);
        }
    });

}


function addQty(item_id, stock_qty, order_qty) {
    // add specific quantity of the given item
    var qtyUpdateQuery = 'UPDATE products SET ? WHERE ?';

    connection.query(qtyUpdateQuery, [{stock_quantity: stock_qty + order_qty}, {item_id: item_id}], function (err, results) {
        if (err) throw err;
        console.log("Items have been added.");
        getOption();
    });
}


function addNewProduct() {
    // Allow the manager to add a brand new product by filling in all its fields.
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the name of the product to add:",
            name: "name"
        },
        {
            type: "input",
            message: "Enter the department for the product:",
            name: "dept"
        },
        {
            type: "input",
            message: "Enter the stock quantity:",
            name: "qty",
            validate: function (num) {
                return (!isNaN(num) && num > 0)
            }
        },
        {
            type: "input",
            message: "Enter the item price:",
            name: "price",
            validate: function (num) {
                return (!isNaN(num) && num > 0)
            }
        }
    ]).then(function (inquirerResponse) {
        // insert into the DB
        connection.query(
            'INSERT INTO products SET ?',
            {
                product_name: inquirerResponse.name,
                department_name: inquirerResponse.dept,
                stock_quantity: inquirerResponse.qty,
                price: inquirerResponse.price
            }
        );
        console.log("The new product has been added.")
        getOption();
    });

}