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

    const inv_id = parseInt(req.params.inv_id, 10);    // Extract the inv_id from the request parameters and parse it as an integer
    const item = await invModel.getInventoryById(inv_id);  // Use the model function to retrieve data for the specific inventory item

    if (!item || item.length === 0) {     // Check if the item is not found or the array is empty
      res.render("errors/error", {         // Render an error view if the item is not found
        title: "Vehicle Not Found",
        message: "Sorry, the requested vehicle could not be found.",
        nav: await utilities.getNav(),
      });
    } else {
      const detailPage = await utilities.buildDetailPage(inv_id);    // Generate the detailPage HTML using the utility function
      if (detailPage !== undefined) {      // Check if the generated detailPage is not undefined
        res.render("inventory/detail", {      // Render the "inventory/detail" view with the retrieved data
          title: `${item.inv_make} ${item.inv_model}`,            // Set the title based on the inv_make and inv_model properties of the first item
          item: item,           // Pass the first item in the array to the view
          nav: await utilities.getNav(),            // Retrieve navigation data using the utility function
          detailPage: detailPage,             // Pass the generated detailPage to the view
        });
      } else {
        res.render("errors/error", {          // Render an error view if detailPage is undefined
          title: "Server Error",
          message: "There was a server error generating the detail page.",
          nav: await utilities.getNav(),
        });
      }
    }
  } catch (error) {
    // Handle any errors that occur during the execution of the function
    console.error("showInventoryDetail error: " + error);

    // Render an error view for server errors
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
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.getDropDown()
    res.render("inventory/management", { //this is the path to the view
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect,
    })
  }


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
      req.flash("notice", `You have successfully added inventory ${inv_make} ${inv_model}`)
      res.status(201).render("./inventory/management", {
        title:"Inventory Management",
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}




/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.getDropDown(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationGrid(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}



/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id, 10)
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", `Deletion Successful.`)
    res.redirect("/inv/") 
  } else {
    req.flash("notice", "Deletion failed.")
    res.redirect("/inv/")  
  }
};






module.exports = invCont;