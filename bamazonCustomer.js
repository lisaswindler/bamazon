var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon",
    multipleStatements: true
});

var all = "SELECT * FROM products";
var both = 'SELECT * FROM products;UPDATE products SET stock_quantity = " + newQuantity + " WHERE item_id = ?" [answer.id]';
var update = '"UPDATE products SET stock_quantity = " + newQuantity + " WHERE item_id = " + itemID"';

function listProducts() {
    connection.query(all, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\nItem #" + res[i].item_id + ": " + res[i].product_name +
                "\nPrice: $" + res[i].price +
                "\nStock: " + res[i].stock_quantity);
        }
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the item number of the product you would like to buy.",
                name: "id",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    console.log("\nPlease enter an item number.");
                    return false;
                  }
            },
            {
                type: "input",
                message: "Enter the purchase quantity.",
                name: "quantity",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    console.log("\nPlease enter a valid quantity.");
                    return false;
                  }
            }
        ])
            .then(function (answer) {      
                if (answer.id < 0 || answer.id > 11) {
                    console.log("Please enter an item number between 1 and 10.");
                }
                else {
                    var itemIndex = res[answer.id - (parseInt(1))];
                    var newQuantity = itemIndex.stock_quantity - parseInt(answer.quantity);
                    var itemPrice = parseInt(itemIndex.price);
                    var itemID = answer.id;
                    console.log("\nYou have chosen item #" + answer.id + ": " + itemIndex.product_name +
                    "\nQuantity in cart: " + answer.quantity +
                    "\nOrder Total: $" + answer.quantity * itemPrice); 
                    if (newQuantity < 0) {
                        console.log("Item stock is too low. Please select a new quantity.");
                    } else {
                        inquirer.prompt([
                            {
                                type: "confirm",
                                message: "Make purchase?",
                                name: "purchase",
                                default: true
                            }
                        ])
                            .then(function (answer) {
                                if (answer.purchase === true) {
                                    console.log("Thank you for your purchase!");
                                //     connection.query("UPDATE products SET stock_quantity = " + 550 + " WHERE item_id = " + 3,
                                //     function (err, res) {
                                //         if (err) throw err;
                                //         console.log(res);
                                //     }
                                // );
                                } else {
                                    console.log("No purchase has been made.");
                                }
                            });
                    }
                }
            });
    });
}


function updateStock() {
    connection.query("UPDATE products SET stock_quantity = " + 330 + " WHERE item_id = " + 3,
        function (err, res) {
            if (err) throw err;
            console.log(res);
        }
    );
}


connection.connect(function (err) {
    if (err) throw err;
    listProducts();
    // updateStock();
    connection.end();
});
