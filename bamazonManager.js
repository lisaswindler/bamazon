var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\033[1mWelcome, Bamazon manager!\033[0m");
    menuOptions();
});

function menuOptions() {
        inquirer.prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Leave'],
            },
        ])
            .then(answers => {
                var selection = answers.options;
                switch (selection) {
                    case 'View Products for Sale':
                        viewProducts();
                        break;
                    case 'View Low Inventory':
                        viewLowInventory();
                        break;
                    case 'Add to Inventory':
                        addToInventory();
                        break;
                    case 'Add New Product':
                        addProduct();
                        break;
                    case 'Leave':
                        console.log("Goodbye!")
                        connection.end();
                        break;
                };
            });
};

function viewProducts() {
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            menuOptions();
        }
    );
};

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < ?", [6],
        function (err, res) {
            if (err) throw err;
            console.log("Here are your low inventory items:");
            console.table(res);
            menuOptions();
        }
    );
};

function addToInventory() {
    connection.query("SELECT item_id,product_name,stock_quantity FROM products",
        function (err, res) {
            console.table(res);
            setTimeout(function () {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Select an item ID to add inventory.",
                        name: "id",
                        validate: function (value) {
                            if (isNaN(value) === false && value > 0 && value <= res.length) {
                                itemIndex = res[value - (parseInt(1))];
                                return true;
                            }
                            console.log("\nPlease enter an item ID between 1 and " + res.length + ".");
                            return false;
                        }
                    },
                    {
                        type: "input",
                        message: "How many items would you like to add to inventory?",
                        name: "add",
                        validate: function (value) {
                            if (isNaN(value) === false && value > 0) {
                                return true;
                            }
                            console.log("\nPlease enter a number.");
                            return false;
                        }
                    }
                ])
                    .then(answers => {
                        var itemID = answers.id;
                        var newQuantity = itemIndex.stock_quantity + parseInt(answers.add);
                        connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, itemID],
                            function (err, res) {
                                if (err) throw err;
                                console.log("Inventory of Item #" + itemID + " has been updated to " + newQuantity + ".");
                                menuOptions();
                            }
                        );
                    });
            }, 100);
        }
    );
};

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "Product name: ",
            name: "product",
            validate: function (value) {
                if (isNaN(value) === true) {
                    return true;
                }
                console.log("\nPlease enter a product name.");
                return false;
            }
        },
        {
            type: "input",
            message: "Department name: ",
            name: "department",
            validate: function (value) {
                if (isNaN(value) === true) {
                    return true;
                }
                console.log("\nPlease enter a department.");
                return false;
            }
        },
        {
            type: "input",
            message: "Item price: ",
            name: "price",
            validate: function (value) {
                if (isNaN(value) === false && value > 0) {
                    return true;
                }
                console.log("\nPlease enter a price.");
                return false;
            }
        },
        {
            type: "input",
            message: "Number of items to add: ",
            name: "quantity",
            validate: function (value) {
                if (isNaN(value) === false && value > 0) {
                    return true;
                }
                console.log("\nPlease enter a number.");
                return false;
            }
        }
    ])
        .then(answers => {
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
                [answers.product, answers.department, answers.price, answers.quantity],
                function (err, res) {
                    if (err) throw err;
                    console.log(answers.product + " has been added to Bamazon.");
                    menuOptions();
                }
            );
        });
}