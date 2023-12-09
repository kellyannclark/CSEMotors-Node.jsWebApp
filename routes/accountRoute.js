const express = require("express");
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/index');
const regValidate = require('../utilities/account-validation');

// Deliver Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Deliver the Account Management View
router.get("/", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountManagement)
);

// Logout route
router.get("/logout", (req, res) => {
  // Clear the JWT cookie to log the user out
  res.clearCookie('jwt');

  // Redirect the user to the login page 
  res.redirect('/account/login');
});

router.get ("/accountUpdate/:account_id", 
utilities.handleErrors(accountController.buildUpdate));

//Process Account Update
  router.post ("/accountUpdate",
  regValidate.checkAccountData, // Validation for general account update
  utilities.handleErrors(accountController.accountUpdate)
);

//Process Password Update
router.post ("/passwordUpdate",
regValidate.passwordRules(), // Validation for general account update
utilities.handleErrors(accountController.changePassword)
);


// Process Registration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;
