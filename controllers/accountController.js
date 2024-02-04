const bcrypt = require("bcryptjs")

// Required Elements
const utilities = require("../utilities/")
const accountModel = require("../models/account-model.js")
const invModel = require("../models/inventory-model.js")


//Builds Login View
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null, 
    })
}

// Build Registration View
async function buildRegistration(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

// Process Registration
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null, // Added later
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null, //added later
    })
  }
}

// Process AddClassification Registration
async function registerClassification(req, res) {
  const form = await utilities.buildClassificationForm()
  let nav = await utilities.getNav()
  const { classification_name } = req.body


  const regResult = await invModel.registerClassification(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered the classification ${classification_name}.`
    )
    res.status(201).render("inventory/addClassification", {
      title: "Add Classification",
      nav,
      form,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/addClassification", {
      title: "Add Classification",
      nav,
      form,
      errors: null, //added later
    })
  }
}

module.exports = {buildLogin, buildRegistration, registerAccount, registerClassification}