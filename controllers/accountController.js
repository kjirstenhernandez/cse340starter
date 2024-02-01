// Required Elements
const utilities = require("../utilities/")


//Builds Login View
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

// Build Registration View
async function buildRegistration(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
    })
}

module.exports = {buildLogin, buildRegistration}