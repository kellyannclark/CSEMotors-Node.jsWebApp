const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page" style="color: white;">Home</a></li>';

  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles" style="color: white;">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
 * Constructs the dropdown HTML
 * ************************************ */
Util.getDropDown = async function (classification_id = null) {
  
    let data = await invModel.getClassifications();// Fetch classifications from the database
    let list = `<select name="classification_id" id="classification_id" required>`;// Initialize the dropdown HTML with a required attribute
    list += `<option value=''>Choose a Classification</option>`;// Add an initial default option: "Choose a Classification"
   
    data.rows.forEach((row) => { // Iterate over the classifications
      list += `<option value=${row.classification_id}`; // Add an option for each classification
      
      if (classification_id != null && row.classification_id == classification_id) {// Check if the classification_id matches the provided classification_id
        list += " selected "// If matched, mark the option as "selected"
        isSelected = ""
      }
      list += `>${row.classification_name}</option>`;// Close the option tag and include the classification_name
    }); 
    list += '</select>';// Close the select tag
    return list;// Return the complete HTML for the dropdown
  } 




/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = '<ul id="inv-display" class="classification-grid">'; //  "classification-grid" class to the <ul>
  
  if(data.length > 0){
    data.forEach(vehicle => { 
      grid += '<li class="vehicle-listing">'; //  "vehicle-listing" class to each <li>
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span class="price">$' //  class for price
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid;
}


/* **************************************
 * Build the detail view HTML for a specific inventory item
 * ************************************ */
Util.buildDetailPage = async function (inv_id) {
  const data = await invModel.getInventoryById(inv_id);
  if (!data || data.length === 0) {
    return '<p class="notice">Sorry, the requested vehicle could not be found.</p>';
  }

  const vehicle = data[0];

  const detailPage = `
  <div class="details">
    <img id="detail-image" src="${vehicle.inv_image}" alt="Vehicle Image" />
    <div class="details-info">
      <p>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
      <p>Color: ${vehicle.inv_color}</p>
      <p>Class: ${vehicle.classification_name}</p>
      <p>Miles: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>
      <p>Details: ${vehicle.inv_description}</p>
    </div>
  </div>
`;

return detailPage;

};
/* **************************************
 * Build the Add Inventory view HTML
 * ************************************ */
Util.buildAddInventory = async function() {
  let list = await Util.getDropDown()
  let grid = "";
      grid += '<label>All Fields Are Required</label>'
      grid += '<form class="new-vehicle" action="add-inventory" method="post">'
      grid += '<br>'
      grid += '<fieldset class="vehicle-fieldset">'
      grid += '<label>Classification</label>'
      grid += '<br>'
      + list;
      grid += '<br>'
      grid += '<label>Make</label>'
      grid += '<br>'
      grid += '<input class="input" type="text" name="inv_make" minlength="3" required placeholder="min of 3 characters">'
      grid += '<br>'
      grid += '<label>Model</label>'
      grid += '<br>'
      grid += '<input class="input" type="text" name="inv_model" minlength="3" required placeholder="min of 3 characters">'
      grid += '<br>'
      grid += '<label>Description</label>'
      grid += '<br>'
      grid += '<textarea name="inv_description" rows="5" cols="40" required></textarea>'
      grid += '<br>'
      grid += '<label>Image</label>'
      grid += '<br>'
      grid += '<input name="inv_image" required value="/images/vehicles/no-image.png">'
      grid += '<br>'
      grid += '<label>Thumbnail</label>'
      grid += '<br>'
      grid += '<input name="inv_thumbnail" required value="/images/vehicles/no-image-tn.png">'
      grid += '<br>'
      grid += '<label>Price</label>'
      grid += '<br>'
      grid += '<input class="input" type="number" name="inv_price" required placeholder="decimal or integar">'
      grid += '<br>'
      grid += '<label>Year</label>'
      grid += '<br>'
      grid += '<input class="input" type="number" name="inv_year" required placeholder="4-digit year">'
      grid += '<br>'
      grid += '<label>Miles</label>'
      grid += '<br>'
      grid += '<input class="input" type="number" name="inv_miles" required placeholder="digits only">'
      grid += '<br>'
      grid += '<label>Color</label>'
      grid += '<br>'
      grid += '<input type="text" name="inv_color" required>'
      grid += '<br>'
      grid += '</fieldset>'
      grid += '<input id="addInventory-button" type="submit" value="Add Inventory">'
      grid += '</form';
    

      return grid
      
}     




/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }


 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {   //an "if" check to see if the login flag exists and is "true" in the response object
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }



module.exports = Util;