const express = require("express")
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/index')
const regValidate = require('../utilities/account-validation')
const loginValidate = require('../utilities/account-validation')

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

// Process the login attempt
router.post(
  "/login",
  [
    loginValidate.loginRules(), // Use the login validation rules
    loginValidate.checkLoginData, // Use the checkLoginData function
  ],
  utilities.handleErrors(accountController.login) // Handle login logic in accountController.login
);

module.exports = router;