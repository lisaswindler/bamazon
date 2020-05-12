var mysql = require("mysql");
var inquirer = require("inquirer");
// var command = process.argv[2];
// var input = process.argv.slice(3).join(" ");
var connection = mysql.createConnection({
	host: "localhost",
	port: 8889,
	user: "root",
	password: "root",
	database: "bamazon"
});
function listProducts(){
	//SELECT to view all authors
	connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        console.log("what");
        // for (var i=0; i<res.length; i++) {
        //     console.log("\nItem #" + res[i].item_id +
        //         "\nItem: " + res[i].product_name +
        //         "\nPrice: " + res[i].price);
        // }
	});
}
listProducts();