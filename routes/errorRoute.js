const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

// Route for triggering the intentional error with a callback function
router.get("/", errorController.generateError);

module.exports = router;

