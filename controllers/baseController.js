//The "base" controller will be responsible only for requests to the application 
//in general, and not to specific areas (such as inventory or accounts).


const utilities = require("../utilities/")
const baseController = {}

 baseController.buildHome = async function(req, res){
   const nav = await utilities.getNav()
 //video demo: add this line of code and the message of your choice
   res.render("index", {title: "Home", nav})          //note the two parameters.  First is the "type" of message and its value 
} 
                                                      //is added as a class that can be used to style in CSS.  The second 
                                                      //paramater is the actual message.  Its a string and must be in quotes.
module.exports = baseController                        //Save the file and then "pnpm run dev" in terminal