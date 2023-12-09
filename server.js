/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require('./utilities/index');
const errorRoute = require("./routes/errorRoute")
const session = require("express-session")  //video demo #1
const pool = require('./database/')         //video demo  #1
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")



/* ***********************                  //video demo #2 
 * Middleware                               //add this middleware above the view engine and template section
 * ************************/                //we are going to use PostgreSQL database to place our session info in
app.use(session({                           //this middleware makes it easy for the session to interact w/ the database
  store: new (require('connect-pg-simple')(session))({     //now we'll head to .env at root of project to create the secret value
    createTableIfMissing: true,                             //from line 30
    pool,
  }),
  secret: process.env.SESSION_SECRET,   
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware           //video demo #3
app.use(require('connect-flash')())     //add middleware once session is operational
app.use(function(req, res, next){         //this middleware allows the messages to be set then passes it on to the next process
  res.locals.messages = require('express-messages')(req, res)    //now let's head to the index.ejs to set up the EJS code block in the view
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//Unit 5 Login Activity
app.use(cookieParser())

app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Template
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/

//Error route

app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute);

app.use('/error', errorRoute);

app.use("/account", accountRoute)


/* *****************************
* File Not Found Route - must be last route in list 
* Place after all routes
* Unit 3, Basic Error Handling
**********************************/

app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page."});
});


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = "Sorry, we appear to have lost that page."} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
