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

// Router for server error messages
router.get("/throwerror", invController.buildError);

router.post(
    "/addClassification",
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(accountController.registerClassification)
  )

module.exports = router;