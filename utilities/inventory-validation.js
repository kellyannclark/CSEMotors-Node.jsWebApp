const { body, validationResult } = require("express-validator");

// Validation rules for add-inventory
validate.addInventoryRules = () => {
  return [
    body('classification_name')
      .notEmpty()
      .withMessage('Classification is required')
      .trim(), 

    body('inv_make')
      .notEmpty()
      .withMessage('Make is required')
      .isLength({ min: 3 })
      .withMessage('Make must be at least 3 characters')
      .trim(), 

    body('inv_model')
      .notEmpty()
      .withMessage('Model is required')
      .isLength({ min: 3 })
      .withMessage('Model must be at least 3 characters')
      .trim(), 

    body('inv_year')
      .notEmpty()
      .withMessage('Year is required')
      .isNumeric()
      .withMessage('Year must be a number')
      .isLength({ min: 4, max: 4 })
      .withMessage('Year must have 4 digits')
      .trim(), 

    body('inv_price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0.01 }) 
      .withMessage('Price must be a decimal or integer')
      .trim(), 

    body('inv_miles')
      .notEmpty()
      .withMessage('Miles is required')
      .isNumeric()
      .withMessage('Miles must be a number')
      .trim(), 
  ];
};

// Middleware to check validation results and handle form stickiness
validate.checkAddInventoryData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { classification_name, inv_make, inv_model, inv_year, inv_price, inv_miles } = req.body;
    res.render('./inventory/add-inventory', {
      errors: errors.array(),
      title: 'Add Inventory',
      classification_name,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
    });
  } else {
    next();
  }
};

module.exports = validate;
