//The "base" controller will be responsible only for requests to the application 
//in general, and not to specific areas (such as inventory or accounts).


const utilities = require("../utilities/")
const baseController = {}

 baseController.buildHome = async function(req, res){
   const nav = await utilities.getNav()
   res.render("index", {title: "Home", nav})
}

module.exports = baseController