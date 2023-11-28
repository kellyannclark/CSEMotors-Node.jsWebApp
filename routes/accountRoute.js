const express = require("express")
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/index')
const regValidate = require('../utilities/account-validation')


//Deliver Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Deliever Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//Process Registration

router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accounBtLogin)
)


// New Default Route for Accounts
router.get("/", 
//utilities.checkLogin,
utilities.handleErrors(accountController.accountManagement));


module.exports = router;