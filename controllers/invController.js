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

/* ***************************
 *  Build by management view
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
 *  Build ADD classification view
 * ************************** */
invCont.addClassificationView = async function (req, res, next) {
  try {
    const messages = req.flash();
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", { //this is the path to the view
      title: "Add Classification",
      nav,
      messages,
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
 *  ADD new Classification to DB
 * ************************** */

invCont.addNewClassification = async (req, res) => {
  try {
    const { classification_name } = req.body;
    
    // Insert the new classification into the database
    await invModel.insertNewClassification(classification_name);

    // Fetch the updated nav data
    const newNav = await utilities.getNav();
    
    res.render('./inventory/management', {
      title: 'Inventory Management',
      nav: newNav, // Pass the updated nav data
      messages: { success: 'Classification added successfully.' },
    });
  } catch (error) {
    console.error('addNewClassification error:', error);
    req.flash('error', 'Failed to add classification. Please try again.');
    res.redirect('/inventory/add-classification');
  }
};


/* ***************************
 * Build ADD inventory view
 * ************************** */
invCont.addInventoryView = async function (req, res, next) {
  try {
    const messages = req.flash();
    let nav = await utilities.getNav();
   
    const classification_name = await invModel.getClassifications(); 
    const classificationOptions = await utilities.populateDropDown();

    console.log(classification_name);
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      messages,
      classification_name,
      classificationOptions, 
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

invCont.addInventory = async (req, res) => {
  try {
    const {
      classification_name,
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

    // Determine the classification_id based on the selected classification_name
    const classification_id = await invModel.getInventoryByClassificationId(classification_name);

    // Insert inventory into the database
    await invModel.insertInventory({
      classification_id,
      classification_name,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_color,
      inv_miles,
    });

    res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      message: 'Inventory added successfully.',
      nav: await utilities.getNav(),
    });
  } catch (error) {
    console.error('Add Inventory error:', error);
    req.flash('error', 'Failed to add inventory. Please try again.');
    res.redirect('/inv/add-inventory'); // Redirect back to the add-inventory page with an error message
  }
};



module.exports = invCont;




