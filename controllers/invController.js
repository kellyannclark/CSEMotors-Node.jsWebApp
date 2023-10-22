const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build by detail view
 * ************************** */
invCont.showInventoryDetail = async function (req, res) {
  try {
    const inv_id = parseInt(req.params.inv_id, 10);

    //Use the model function to retrieve data for the specific inventory item
    const item = await invModel.getInventoryById(inv_id);

    if (!item || item.length === 0) {
      res.render("errors/error", {
        title: "Vehicle Not Found",
        message: "Sorry, the requested vehicle could not be found.",
        nav: await utilities.getNav(),
      });
    } else {
      // Generate the detailPage HTML using the utility function
      const detailPage = await utilities.buildDetailPage(inv_id);

      // Render the "inventory/detail" view with the detailPage variable
      res.render("inventory/detail", {
        title: `${item[0].inv_make} ${item[0].inv_model}`,
        item: item[0],
        nav: await utilities.getNav(),
        detailPage: detailPage, // Pass detailPage to the view
      });
    }
  } catch (error) {
    console.error("showInventoryDetail error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }
};





module.exports = invCont;




