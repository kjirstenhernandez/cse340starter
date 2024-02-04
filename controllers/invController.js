const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildVehicleDetails = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const grid = await utilities.buildSingleGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_make + data[0].inv_model
  res.render("./inventory/single", {
    title: className,
    nav,
    grid,
  })
}

/* ***************************
 *  Build error page
 * ************************** */
invCont.buildError = function (req, res, next) {
  throw {message:"Error"}
  }

/* ***************************
 *  Build Management page
 * ************************** */
invCont.buildManagement = async function (req,res,next) {
  const grid = await utilities.buildLinks("./addClassification", "./add-inventory")
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    grid
}
  )}

/* *******************************
 *  Build addClassification Page
 * ******************************* */

invCont.buildAddClassification = async function (req,res,next) {
  const form = await utilities.buildClassificationForm()
  let nav = await utilities.getNav()
  res.render("./inventory/addClassification", {
    title: "Add a Classification",
    nav,
    form,
    errors: null,
}
  )}
  
module.exports = invCont