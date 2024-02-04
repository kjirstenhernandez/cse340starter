// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/account-validation")
const accountController = require("../controllers/accountController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory with single view
router.get("/detail/:inventoryId", invController.buildVehicleDetails);

// Route to build management page
router.get("/management", invController.buildManagement);

// Route to build addClassification page
router.get("/addClassification", invController.buildAddClassification);

// Route to build addClassification page
router.get("/add-inventory", invController.buildAddInventory);

// Router for server error messages
router.get("/throwerror", invController.buildError);

// Processing data for Add Classification page
router.post(
    "/addClassification",
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(accountController.registerClassification)
  )
// Processing data for Add Inventory page
router.post(
    "/add-inventory",
    invValidate.addInventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(accountController.registerInventory)
  )

module.exports = router;