const invModel = require("../models/inventory-model")
const Util = require("../utilities/")
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
  const grid = await utilities.buildLinks("./addClassification", "./add-inventory", "./deleteClassification")
  let nav = await utilities.getNav()
  const classificationSelect = await Util.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    grid,
    errors: null,
    classificationSelect,
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
/* *******************************
 *  Build deleteClassification Page
 * ******************************* */

invCont.buildDeleteClassification = async function (req,res,next) {
  let data = await invModel.getClassifications()
  const form = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  res.render("./inventory/deleteClassification", {
    title: "Delete a Classification",
    nav,
    form,
    errors: null,
}
  )}

/* *******************************
 *  Build addInventory Page
 * ******************************* */

invCont.buildAddInventory = async function (req,res,next) {
  let data = await invModel.getClassifications()
  const form = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    form,
    errors: null,
}
  )}

/* ***************************
*  Return Inventory by Classification As JSON
* ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
const classification_id = parseInt(req.params.classification_id)
const invData = await invModel.getInventoryByClassificationId(classification_id)
if (invData[0].inv_id) {
  return res.json(invData)
} else {
  next(new Error("No data returned"))
}
}

/* ***************************
*  Build Edit Inventory Page
* ************************** */
invCont.buildEditInventory = async function (req,res,next) {
  const classList = await invModel.getClassifications();
  const inventoryId = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let data = await invModel.getInventoryByInventoryId(inventoryId)
  data = data[0]
  let makeModel = `${data.inv_make} ${data.inv_model}`
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/edit-inventory", {
    title: `Edit ${makeModel}`,
    nav,
    form: classificationSelect,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id,
}
  )}


/* **********************************
 *  Process to Update Inventory Data
 * ********************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
  
    if (updateResult) {
      req.flash(
        "notice",
        `Congratulations, ${inv_make} ${inv_model} has been updated.`
      )
      res.status(201).render("inventory/management")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Update Inventory",
        nav,
        form: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
  }

/* *****************************************
 *  Process to Register New Classification
 * ***************************************** */
  // Process AddClassification Registration
invCont.registerClassification = async function (req, res) {
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

  
/* *****************************************
 *  Process New Inventory
 * ***************************************** */ 
invCont.registerInventory = async function (req, res) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_miles, inv_color, inv_price, classification_id} = req.body
  const regResult = await invModel.registerInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_miles, inv_color, inv_price, classification_id)
  let nav = await utilities.getNav()
  const form = await utilities.buildClassificationList()

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


/* ***************************
*  Build Inv Delete Page
* ************************** */
invCont.buildDeleteInventoryView = async function (req,res,next) {
  const inv_id= parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let data = await invModel.getInventoryByInventoryId(inv_id)
  data = data[0]
  let makeModel = `${data.inv_make} ${data.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: `Delete ${makeModel}`,
    nav,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_price: data.inv_price,
}
  )}

  /* ***************************
*  Build Class Delete Page (confirm)
* ************************** */
invCont.buildDeleteClassificationView = async function (req,res,next) {
  const classification_id= parseInt(req.params.classification_id)
  let nav = await utilities.getNav()
  let classification_name = await invModel.getClassificationName(classification_id)
  let form = await utilities.buildDeleteClassForm(classification_id, classification_name)
  res.render("./inventory/deleteClass-confirm", {
    title: `Delete ${classification_name}?`,
    nav,
    errors: null,
    form
}
  )}



/* **********************************
 *  Process to Delete Inventory Data
 * ********************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventory(inv_id)
  console.table(deleteResult)
  if (deleteResult) {
    req.flash("notice", `Successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("inv/delete/{inv_id}")
    }
  }
  
/* **********************************
 *  Process to Delete Classification Data
 * ********************************** */
invCont.deleteClassification = async function (req, res, next) {
  const classification_id = req.body.classification_id
  const deleteResult = await invModel.deleteClassification(classification_id)
  const grid = await utilities.buildLinks("./addClassification", "./add-inventory", "./deleteClassification")
  let nav = await utilities.getNav()
  const classificationSelect = await Util.buildClassificationList()
  if (deleteResult) {
    req.flash(
      "notice",
      `Congratulations, deletion was successful.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      grid,
      errors: null,
      classificationSelect,
    })
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      grid,
      errors: null,
      classificationSelect,
    })
  }}
  


module.exports = invCont