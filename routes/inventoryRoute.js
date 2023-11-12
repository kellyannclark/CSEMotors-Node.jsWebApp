// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities/index');


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for displaying a specific inventory item
router.get("/detail/:inv_id", utilities.handleErrors(invController.showInventoryDetail));

//Route for displaying the management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to render the add-classification view
router.get('/add-classification', utilities.handleErrors(invController.addClassificationView));

// Route to handle form submission for adding a new classification
router.post('/add-classification', utilities.handleErrors(invController.addNewClassification));

// Route to render the add-inventory view
router.get('/add-inventory', utilities.handleErrors(invController.addInventoryView));

// Route to handle form submission for adding a new inventory
router.post('/add-inventory', utilities.handleErrors(invController.addInventory));




module.exports = router;