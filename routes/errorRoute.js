const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");
const utilities = require('../utilities/index');

// Route for triggering the intentional error with a callback function
router.get("/", utilities.handleErrors(errorController.generateError));

module.exports = router;

