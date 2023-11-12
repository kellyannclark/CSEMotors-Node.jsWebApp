const utilities = require('../utilities/index')
const accountModel = require("../models/account-model")



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {  //Line 4 - begins the function, declaring it as asynchronous, and passing in request, response and next as parameters.
    let nav = await utilities.getNav()    //retrieves and stores the navigation bar string for use in the view.
    res.render("account/login", {   //calls the render function and indicates the view to be returned to the client and opens the object that will carry data to the view.
      title: "Login",
      nav,  
      errors: null, //the data items to be sent to the view.
    })   //closes the data object and the render function
  }

  /* ****************************************
*  Deliver Register view
* *************************************** */

  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
  }
  

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

  
  /* ****************************************
*  Process Login
* *************************************** */
async function login(req, res) {
  let nav = await utilities.getNav();

  // Retrieve login data from the request body
  const { account_email, account_password } = req.body;

  // Replace this with your login logic:
  // Check if the user with the provided email and password exists in your database
  const user = await accountModel.getUserByEmail(account_email);

  if (user) {
    // User found, check the password
    const isPasswordValid = await accountModel.checkPassword(user, account_password);

    if (isPasswordValid) {
      // Password is correct, create a session or token to authenticate the user
      // Implement your session or token creation logic here

      // Redirect the user to a protected page, e.g., the home page
      res.redirect("/home");
    } else {
      // Password is incorrect
      req.flash("notice", "Incorrect password. Please try again.");
      res.status(401).render("account/login", {
        title: "Login",
        nav,
      });
    }
  } else {
    // User not found
    req.flash("notice", "User not found. Please register an account.");
    res.status(404).render("account/login", {
      title: "Login",
      nav,
    });
  }
}

module.exports = { buildLogin, registerAccount, buildRegister, login };

  