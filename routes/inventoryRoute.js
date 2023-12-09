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
router.get("/", 
utilities.checkTokenAndAccountType,
utilities.handleErrors(invController.buildManagementView));

// Deliver add-classification view
router.get('/add-classification', 
utilities.checkTokenAndAccountType,
utilities.handleErrors(invController.addClassificationView));

// Deliver the add-inventory view
router.get('/add-inventory', 
utilities.checkTokenAndAccountType,
utilities.handleErrors(invController.addInventoryView));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inv_id", 
utilities.checkTokenAndAccountType,
utilities.handleErrors(invController.editInventoryView));

router.get("/delete/:inv_id",
utilities.checkTokenAndAccountType,
utilities.handleErrors(invController.deleteInventoryView));


router.post('/delete/',
    utilities.handleErrors(invController.deleteInventory));

// Route to add a new classification
router.post('/add-classification', 
    classValidation.classificationRules(),
    classValidation.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification));

// Route to add new inventory
router.post('/add-inventory', 
    inventoryValidation.addInventoryRules(),
    inventoryValidation.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
    );
    
//Route to update existing inventory
router.post("/update/", 
    inventoryValidation.checkUpdateData,
    invController.updateInventory,
    utilities.handleErrors(invController.updateInventory));


module.exports = router;