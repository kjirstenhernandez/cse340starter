// Needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const logValidate = require("../utilities/account-validation")

// Process to build the Login Page 
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process to build the Registration Page
router.get("/register", utilities.handleErrors(accountController.buildRegistration))

// Process the Registration Data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Login Process
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildManagement))


module.exports = router;