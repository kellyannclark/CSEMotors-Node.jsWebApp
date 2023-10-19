const invModel = require("../models/inventory-model")

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
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




/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util;