
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const errorController = {};


  errorController.generateError = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    //let nav = await utilities.getNav()
    res.render("./inventory/classification", {
      title: " vehicles",
      nav,
      grid,
    })
  }

module.exports = errorController;



