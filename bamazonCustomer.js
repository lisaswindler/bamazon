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

var newQuantity = "";
var itemID = "";

connection.connect(function (err) {
    if (err) throw err;
    buyProducts();
});

function buyProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
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
                validate: function (value) {
                    if (isNaN(value) === false && value > 0 && value <= res.length) {
                        itemIndex = res[value - (parseInt(1))];
                        return true;
                    }
                    console.log("\nPlease enter an item number between 1 and " + res.length + ".");
                    return false;
                }
            },
            {
                type: "input",
                message: "How many would you like?",
                name: "quantity",
                validate: function (value) {
                    if (isNaN(value) === false && value > 0 && value <= itemIndex.stock_quantity) {
                        return true;
                    }
                    console.log("\nPlease check item stock and enter a valid quantity.");
                    return false;
                }
            }
        ])
            .then(function (answer) {
                newQuantity += itemIndex.stock_quantity - parseInt(answer.quantity);
                itemID += answer.id;
                var itemPrice = parseInt(itemIndex.price);
                console.log("\nYou have chosen item #" + answer.id + ": " + itemIndex.product_name +
                    "\nQuantity in cart: " + answer.quantity +
                    "\nOrder Total: $" + answer.quantity * itemPrice);
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
                            updateStock();
                        } else {
                            console.log("No purchase has been made.");
                            connection.end();
                        }
                    });
            });
    });
}

function updateStock() {
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, itemID],
        function (err, res) {
            if (err) throw err;
            console.log("Stock of Item #" + itemID + " has been updated to " + newQuantity + ".");
        }
    );
    connection.end();
}