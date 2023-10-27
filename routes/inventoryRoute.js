// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities/index');


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for displaying a specific inventory item
router.get("/detail/:inv_id", utilities.handleErrors(invController.showInventoryDetail));






module.exports = router;