const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator");
const validate = {}


/*  **********************************
 *  Add Inventory Validation Rules
 * ********************************* */

validate.addInventoryRules= () => {
  return [
    body('classification_id')
      .trim()
      .notEmpty()
      .withMessage('Classification is required'),
      

    body('inv_make')
      .trim()
      .notEmpty()
      .withMessage('Make is required')
      .isLength({ min: 3 })
      .withMessage('Make must be at least 3 characters'),

    body('inv_model')
      .trim()
      .notEmpty()
      .withMessage('Model is required')
      .isLength({ min: 3 })
      .withMessage('Model must be at least 3 characters'),

    body('inv_year')
      .trim()
      .notEmpty()
      .withMessage('Year is required')
      .isNumeric()
      .withMessage('Year must be a number')
      .isLength({ min: 4, max: 4 })
      .withMessage('Year must have 4 digits'),

    body('inv_description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),

    body('inv_image')
      .trim()
      .notEmpty()
      .withMessage('image is required'),

    body('inv_thumbnail')
      .trim()
      .notEmpty()
      .withMessage('thumbnail is required'),

    body('inv_price')
      .trim()
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0.01 }) 
      .withMessage('Price must be a decimal or integer'),

    body('inv_miles')
      .trim()
      .notEmpty()
      .withMessage('Miles is required')
      .isNumeric()
      .withMessage('Miles must be a number'),

    body('inv_color')
      .trim()
      .notEmpty()
      .withMessage('Color is required'),

  ];
};

  /* ******************************
 * Check data and return errors or continue to add inventory view
 * ***************************** */


validate.checkAddInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const {       
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      price,
      inv_color,
      miles, } = req.body;

      const nav = await utilities.getNav()
      const grid = await utilities.buildAddInventory()
      
    res.render('./inventory/add-inventory', {
      errors: errors.array(),
      title: 'Add Inventory',
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
      nav,
      grid,
    });
  } else {
    next();
  }
};

  /* ******************************
 * Check data and return errors or continue to edit inventory view
 * ***************************** */


  validate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const {    
        inv_id,   
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        price,
        inv_color,
        miles, } = req.body;
  
        const nav = await utilities.getNav()
        const grid = await utilities.buildAddInventory()
      
        
        
        const itemName = `${itemData.inv_make} ${itemData.inv_model}`    
      res.render('./inventory/edit-inventory', {
        errors: errors.array(),
        title: "Edit " + itemName,
        inv_id,
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
        nav,
        grid,
      });
    } else {
      next();
    }
  };
  


/*  **********************************
 *  Add Classification Validation Rules
 * ********************************* */


validate.classificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .notEmpty()
      .withMessage('Classification name is required')
      .matches(/^[A-Za-z]+$/)
      .withMessage('Classification name must contain only alphabetical characters')
      .withMessage('Classification name cannot contain spaces or special characters'),
  ];
};



  /* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name
      
    })
    return
  }
  next()
}







module.exports = validate;
