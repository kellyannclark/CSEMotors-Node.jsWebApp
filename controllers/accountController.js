const utilities = require('../utilities/index')
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()



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
*  Deliver update view
* *************************************** */
async function buildUpdate(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(account_id);
  
  // Check if there is a flash message
  const flashMessage = req.flash("notice")[0] || "";

  res.render("account/accountUpdate", {
    title: "Account Update",
    nav,
    message: flashMessage, // Include flash message in messages
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hashSync(account_password, 10);

        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword  // Pass the hashed password, not the original one
        );

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you\'re registered ${account_firstname}. Please log in.`
            );
            res.status(201).render("account/login", {
                title: "Login",
                nav,
            });
        } else {
            req.flash("notice", "Sorry, the registration failed.");
            res.status(501).render("account/register", {
                title: "Registration",
                nav,
            });
        }
    } catch (error) {
        console.error(error);
        req.flash("notice", 'Sorry, there was an error processing the registration.');
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        });
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

  /* ****************************************
*  Process Account Login request     Unit 5 Login Process Activity - Authenticate
* *************************************** */

async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body //extracts email and pw from req body
  const accountData = await accountModel.getAccountByEmail(account_email)//fetches account data from model
  if (!accountData) { //if no account data found then ...
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) { //if matches then it removes the hashed pw from account data and generates a JWT
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })//makes JWT
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })//sets it as an http only cookie
   return res.redirect("/account/")//if pw comparison is successful, it redirects to this route
   }
  } catch (error) {//if error occurs
   return new Error('Access Forbidden')
  }
 }
  /* ****************************************
*  Deliver Account Management View
* *************************************** */

async function accountManagement(req, res) {
  let nav = await utilities.getNav()
  req.flash(
    "notice",
    `You're logged in.`
);
  res.render("account/accountManagement", {
    title: "Account Management",
    nav, 
    errors: null,
 
  })
}

/* ****************************************
*  Handle the Account Update Process
* *************************************** */

async function accountUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body; // Extract names and email from req. body
  console.log("info", account_firstname, account_lastname, account_email, account_id)
  let accountData;  // Declare accountData here
  
  try {
    const updatedAccount = await accountModel.updateAccountData(account_id, {
      account_firstname,
      account_lastname,
      account_email,
    });

    if (updatedAccount) {
      req.flash("notice", "Account updated successfully.");
    } else {
      req.flash("notice", "Failed to update account.");
    }

    accountData = await accountModel.getAccountById(account_id);
    res.locals.accountData.account_firstname = accountData.account_firstname;
    res.locals.accountData.account_lastname = accountData.account_lastname;
    res.locals.accountData.account_email = accountData.account_email;
    res.render("account/accountManagement", {
      title: "Account Management",
      nav,
      errors: null,
      message: req.flash('notice'),
    });
  } catch (error) {
    console.error(error);

    req.flash("notice", "An error occurred during the account update process.");
    res.render("account/accountUpdate", {
      title: "Account Update",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      accountData: accountData || {},
      message: req.flash('notice'),
    });
  }
}





/* ****************************************
*  Handle the Password Change Process
* *************************************** */

async function changePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body; // Extract new password from req. body
  console.log("new password", account_password, account_id)
  try {

    // Update the password in the database
    const passwordUpdateResult = await accountModel.updatePassword(account_password, account_id);

    if (passwordUpdateResult) {
      // Success message
      req.flash("notice", "Password changed successfully.");
    } else {
      // Failure message
      req.flash("notice", "Failed to change password.");
    }

    // Query the account data from the database after the password update is done
    const accountData = await accountModel.getAccountById(req.account_id);

    // Deliver the management view where the updated account information will be displayed
    res.render("account/accountManagement", {
      title: "Account Management",
      nav,
      errors: null,
      accountData,
    });
  } catch (error) {
    console.error(error);
    // Handle other errors (e.g., database error)
    req.flash("notice", "An error occurred during the password change process.");
    res.redirect("/"); 
  }
}





module.exports = { buildLogin, registerAccount, buildRegister, login, accountLogin, accountManagement, buildUpdate, accountUpdate, changePassword};

  