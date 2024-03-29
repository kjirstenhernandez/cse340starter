const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
            require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the Single view HTML
* ************************************ */

Util.buildSingleGrid = async function(data){
  let grid
  grid = "<div class=singleGrid>"
  data.forEach(vehicle => {
    grid += '<section id=singleImage>'
      grid += '<img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" />'
    grid += '</section>'
    grid += '<section id=singleDetails>'
      grid += `<h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>`
      grid += `<p><b>Price:</b> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
      grid += `<p><b>Description:</b> ${vehicle.inv_description}</p>`
      grid += `<p><b>Color:</b> ${vehicle.inv_color}</p>`
      grid += `<p><b>Miles:</b> ${vehicle.inv_miles}</p>`
    grid += '</section>'
  })
  grid += "</div>"

  return grid
}


/* ****************************************
 * Build Management View
 **************************************** */
Util.buildLinks = async function(classificationLink, vehicleLink, deleteLink) {
  let grid
  grid = "<div class=management>"
  grid+= `<a href="${classificationLink}"> Add New Classification</a>`
  grid+= `<a href="${vehicleLink}"> Add New Vehicle</a>`
  grid+= `<a href="${deleteLink}">Delete Classification</a>`
  grid += "</div>"

  return grid
  }



/* ****************************************
 * Build addClassification Form
 **************************************** */
Util.buildClassificationForm = async function () {
  let form = 
    "<div class='addClass'>" +
        "<p>Field is Required</p>" +
        "<fieldset>" +
          "<form id='addClassForm' class='form' method='post' action='/inv/addClassification'>" +
            "<label class='above' for='classification_name'>Classification Name</label>" +
            "<span id=rules>Name must be alphabetic characters only</span>" +  
            "<input type='text' id=newClassName placeholder='e.g. Truck' name='classification_name' pattern='^[a-zA-Z]*$' required>" +
            "<input type='submit' id=classSubmit>" +
          "</form>" +
        "</fieldset>" +
    "</div>"

    return form
}

/* ****************************************
 * Build addInventory Form
 **************************************** */
Util.buildClassificationList = async function (selectClassId) {
  let data = await invModel.getClassifications()
  let form = "<select id='classificationList' name='classification_id'>"
          form += "<option>Select One</option>"
          data.rows.forEach((row) => {
          form += `<option value='${row.classification_id}'`
          if (row.classification_id == selectClassId) {
            form += ' selected';
          }
          form+= `>${row.classification_name}</option>`})
        form += "</select>"
    return form
}
/* ****************************************
 * Build deleteClass Confirm Form
 **************************************** */
Util.buildDeleteClassForm = async function (classification_id, classification_name) {
  let form = `
    <form id='deleteForm' class="form" method='post' action='/inv/deleteClass'>
      <fieldset>
        <p>Confirm Deletion: Changes are Permanent</p>    
        <label class='above' for=classification_name>Make</label>
        <input readonly id=addMake type='text' name='classification_name' required value="${classification_name}"> 
        <input type="hidden" name="classification_id" value="${classification_id}">
        <input type='submit' id=classSubmit value="Delete Classification">
      </fieldset>
    </form>`
    return form
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *    Build Account Grid (per Status)
 * ***************************************** */
 Util.createAccountGrid = (loggedIn, accountType) => {
  let grid
  if (loggedIn && (accountType === "Admin" || accountType === "Employee")){
    grid = '<div class="manageButton">'
    grid += "<a href='../../inv/' >Edit Inventory</a>"
    grid += '</div>'}
  else {
    grid += ''
  }
  return grid
  }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


module.exports = Util