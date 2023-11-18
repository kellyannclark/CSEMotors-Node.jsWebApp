// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities/index');
const classValidation = require('../utilities/inventory-validation')
const inventoryValidation = require('../utilities/inventory-validation')


// Deliver inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Deliver displaying a specific inventory item
router.get("/detail/:inv_id", utilities.handleErrors(invController.showInventoryDetail));

//Deliver the management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Deliver add-classification view
router.get('/add-classification', utilities.handleErrors(invController.addClassificationView));

// Deliver the add-inventory view
router.get('/add-inventory', utilities.handleErrors(invController.addInventoryView));

// Process add a new classification
router.post('/add-classification', 
    classValidation.classificationRules(),
    classValidation.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification));

// Process add new inventory
router.post('/add-inventory', 
    inventoryValidation.addInventoryRules(),
    inventoryValidation.checkAddInventoryData,
    
    utilities.handleErrors(invController.addInventory)
    );
    


module.exports = router;