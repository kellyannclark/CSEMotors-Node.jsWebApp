const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Deliver inventory by classification view
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
 *  Deliver detail view
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

/* ***************************
 *  Deliver management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const messages = req.flash();
    let nav = await utilities.getNav();
    res.render("inventory/management", { //this is the path to the view
      title: "Inventory Management",
      nav,
      messages,
    });
  } catch (error) {
    console.error("buildManagementView error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }
};


/* ***************************
 *  Deliver ADD classification view
 * ************************** */

invCont.addClassificationView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", { //this is the path to the view
      title: "Add Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Add Classification error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }
};


/* ***************************
 *  Process add new Classification 
 * ************************** */

invCont.addNewClassification = async (req, res) => {
  try {
    const { classification_name } = req.body;
    
    // Insert the new classification into the database
    await invModel.insertNewClassification(classification_name);

    // Fetch the updated nav data
    const newNav = await utilities.getNav();
        // Set flash message
      req.flash("notice", "You've added a new classification");

      res.render('./inventory/add-classification', {
      title: 'Add Classification',
      nav: newNav, // Pass the updated nav data
      errors: null,
    });
  } catch (error) {
    console.error('addNewClassification error:', error);
    req.flash('error', 'Failed to add classification. Please try again.');
    res.redirect('/inventory/add-classification');
  }
};


/* ***************************
 * Deliver add inventory view
 * ************************** */
invCont.addInventoryView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let grid = await utilities.buildAddInventory();
    const classificationOptions = await utilities.getDropDown();

    console.log(classificationOptions);
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      grid,
      classificationOptions,
      errors: null,
      layout: './layouts/layout'
    });
  } catch (error) {
    console.error("Add Inventory View error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }
};


/* ***************************
 * Process add inventory
 * ************************** */

invCont.addInventory = async (req, res, next) => {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_color,
      inv_miles,
    } = req.body;

    const price = parseInt(inv_price)
    const miles = parseInt(inv_miles)


    let result = await invModel.insertInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      price,
      inv_color,
      miles,
    )

    let nav = await utilities.getNav()
    
    if(result) {
      req.flash("notice", `You have successfully added inventory, ${inv_make} ${inv_model}`)
      res.status(201).render("./inventory/management", {
        title:"Add Inventory",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    let grid = await utilities.buildAddInventory()
    console.error('Add Inventory error:', error);
    req.flash('error', 'Failed to add inventory. Please try again.');
    res.status(500).render("./inventory/add-inventory", {
      title:"Add Inventory",
      nav,
      grid,
      errors: null,
    })
  }
};



module.exports = invCont;




