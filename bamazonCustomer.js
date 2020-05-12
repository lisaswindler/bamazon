var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 8889,
	user: "root",
	password: "root",
	database: "bamazon"
});

function listProducts(){
	connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        console.log(res);
        for (var i=0; i<res.length; i++) {
            console.log("\nItem #" + res[i].item_id +
                "\nItem: " + res[i].product_name +
                "\nPrice: " + res[i].price);
        }
        inquirer.prompt([
                {
                type: "input",
                message: "Enter the ID of the product you would like to buy.",
                name: "id"
                },
                {
                type: "input",
                message: "Enter the purchase quantity.",
                name: "quantity"
                }
                ])
                .then(function(answer) {
                console.log("\nYou have chosen item #" + answer.id + ": " + res[answer.id - (parseInt(1))].product_name);
                console.log("Quantity in cart: " + answer.quantity);
                });
                // prompt.next({
                //         type: "confirm",
                //         message: "Make purchase?",
                //         name: "purchase",
                //         default: true
                // })
                //         .then(function(answer) {
                //                 if (answer.confirm) {
                //                 console.log("Thank you for your purchase!");
                //                 } else {
                //                 console.log("No purchase has been made.");
                //                 }
                //         });
        });
}

connection.connect(function(err) {
	if(err) throw err;
        listProducts();
        // promptToBuy();
        connection.end();
});
