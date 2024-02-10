
// Required Elements
const utilities = require("../utilities/")
const accountModel = require("../models/account-model.js")
const invModel = require("../models/inventory-model.js")
const jwt = require("jsonwebtoken")
            require("dotenv").config()
const bcrypt = require("bcryptjs")

/* ************************
        BUILD VIEWS
**************************/

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

// Build Account Management Page
async function buildManagement(req, res){
  let nav = await utilities.getNav()
  let loginStatus = res.locals.loggedin
  let accountType = res.locals.accountData.account_type
  let accountStatus = utilities.createAccountGrid(loginStatus, accountType)
  res.render("./account/management", {
      title: "Account Management",
      nav,
      accountType,
      accountStatus,
      errors: null,
  })
}

/* ************************
        PROCESSES
**************************/

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

// Process Login Request
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


// Process Logout Request
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.locals.loggedin = false;
  res.redirect("/login")
}



module.exports = {buildLogin, buildRegistration, registerAccount, accountLogin, buildManagement, accountLogout } //registerInventory, registerClassification