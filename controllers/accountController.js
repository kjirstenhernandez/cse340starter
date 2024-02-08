

// Required Elements
const utilities = require("../utilities/")
const accountModel = require("../models/account-model.js")
const invModel = require("../models/inventory-model.js")
const jwt = require("jsonwebtoken")
            require("dotenv").config()
const bcrypt = require("bcryptjs")


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

// Build Account view
async function buildManagement(req, res, next){
  let nav = await utilities.getNav()
  res.render("account/management", {
      title: "Management",
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

// Process Add-Inventory Registration
async function registerInventory(req, res) {
  let data = await invModel.getClassifications()
  const form = await utilities.buildClassificationList(data)
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_miles, inv_color, inv_price, classification_name } = req.body
  const classification_id = await invModel.getClassificationId(classification_name)
  console.log(classification_id);
  const regResult = await invModel.registerInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_miles, inv_color, inv_price, classification_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered a new vehicle.`
    )
    res.status(201).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      form,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      form,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
 let nav = await utilities.getNav()
 const { account_email, account_password } = req.body
 const accountData = await accountModel.getAccountByEmail(account_email)
 if (!accountData) {
  req.flash("notice", "Please check your credentials and try again.")
  res.status(400).render("account/login", {
   title: "Login",
   nav,
   errors: null,
   account_email,
  })
 return
 }
 try {
  if (await bcrypt.compare(account_password, accountData.account_password)) {
  delete accountData.account_password
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
  res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
  return res.redirect("/account/")
  }
 } catch (error) {
  return new Error('Access Forbidden')
 }
}
module.exports = {buildLogin, buildRegistration, registerAccount, registerClassification, registerInventory, accountLogin, buildManagement }