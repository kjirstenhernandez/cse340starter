const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")

/*  **********************************
 *  AddClassification Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
  body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide a classification name.")
  ]
}

/*  **********************************
 *  Add-Inventory Validation Rules
 * ********************************* */

validate.addInventoryRules = () => {
  return [
    // firstname is required and must be string
    body("inv_make")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Please provide a make."),

  body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Please provide a valid model."),
  
  body("inv_year")
    .trim()
    .custom(async (inv_year) => {
      if (inv_year.length < 4 ){
        throw new Error("Year must be four digits.")
      }})
    .isNumeric()
    .withMessage("Year must be numbers only."),
  
  body("inv_description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a valid description."),

  body("inv_image")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a valid image path."),

  body("inv_thumbnail")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a valid thumbnail path."),
  
  body("inv_price")
    .trim()
    .isLength({ min: 1 })
    .isNumeric(no_symbols = true)
    .withMessage("Please provide a number (no symbols or decimals)."),

  body("inv_miles")
    .trim()
    .isLength({ min: 1 })
    .isNumeric(no_symbols = true)
    .withMessage("Please provide valid mileage (no symbols or decimals)."),

  body("inv_color")
    .trim()
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage("Please provide a valid color."),
    ]}

/* ******************************
* Check Classification Registration
* ***************************** */

validate.checkClassificationData = async (req, res, next) => {
const { classification_name } = req.body
let errors = []
errors = validationResult(req)
if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const form = await utilities.buildClassificationForm()
    res.render("inventory/addClassification", {
        errors,
        title: "Add Classification",
        nav,
        form,
        classification_name
    })
    return
}
next()
}
/* ******************************
* Check Inventory Registration
* ***************************** */

validate.checkInventoryData = async (req, res, next) => {
const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name } = req.body
let errors = []
errors = validationResult(req)
if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let data = await invModel.getClassifications()
    const form = await utilities.buildClassificationList(data)
    res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        form,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_thumbnail,
        inv_image,
        inv_price,
        inv_miles,
        inv_color,
        classification_name //added this
    })
    return
}
next()
}

/* ******************************
* Update Inventory Registration
* ***************************** */

validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let data = await invModel.getClassifications()
        const form = await utilities.buildClassificationList(data)
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit Inventory",
            nav,
            form,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_thumbnail,
            inv_image,
            inv_price,
            inv_miles,
            inv_color,
            classification_name //added this
        })
        return
    }
    next()
    }
    
    /*  **********************************
 *  New-Inventory Validation Rules
 * ********************************* */

validate.newInventoryRules = () => {
    return [
      // firstname is required and must be string
      body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."),
  
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model."),
    
    body("inv_year")
      .trim()
      .custom(async (inv_year) => {
        if (inv_year.length < 4 ){
          throw new Error("Year must be four digits.")
        }})
      .isNumeric()
      .withMessage("Year must be numbers only."),
    
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid description."),
  
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid image path."),
  
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid thumbnail path."),
    
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .isNumeric(no_symbols = true)
      .withMessage("Please provide a number (no symbols or decimals)."),
  
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .isNumeric(no_symbols = true)
      .withMessage("Please provide valid mileage (no symbols or decimals)."),
  
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide a valid color."),
      ]}

module.exports = validate