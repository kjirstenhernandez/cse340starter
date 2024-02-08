const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")

/*  **********************************
 *     Login Data Validation Rules
 * ********************************* */

validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("Please provide a valid email.") 
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists) {
                    throw new Error("Email does not exist.")
                }
            }),

        // password is required and must be strong password
        body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),

    ]
}


/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */

validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

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
    .isLength({ min: 1 })
    .withMessage("Please provide a make."),

  body("inv_model")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a valid model."),
  
  body("inv_year")
    .trim()
    .isLength({ min: 4, max:4 })
    .isNumeric(no_symbols = true)
    .withMessage("Please provide a first name."),
  
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
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  /* ******************************
 * Check password and return errors or continue to login
 * ***************************** */

validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email
        })
        return
    }
    next()
}

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

module.exports = validate