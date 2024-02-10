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

// Login/Logout Process
router.post(
    "/login",
    logValidate.loginRules(),
    logValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))

router.get("/logout", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.accountLogout))

router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildManagement))

// Edit Account
router.get("/update/", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountUpdate))

router.post("/update/", 
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount))

router.post("/change",
    regValidate.updatePasswordRules(), 
    regValidate.checkUpdateData, 
    utilities.handleErrors(accountController.updatePassword))

router.get("/logout",
    utilities.checkLogin,
    utilities.handleErrors(accountController.accountLogout))

module.exports = router;