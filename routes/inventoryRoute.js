// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const accountController = require("../controllers/accountController")

// Router for server error messages
router.get("/throwerror", utilities.handleErrors(invController.buildError));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory with single view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleDetails));

// Route to build management page
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build addClassification page
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification));

// Route to build deleteClassification page
router.get("/deleteClassification", utilities.handleErrors(invController.buildDeleteClassification));

//Build Confirm Delete Classification View
router.get("/delete-class/:classification_id", utilities.handleErrors(invController.buildDeleteClassificationView)),

// Route to build addInventory page
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Processing data for Add Inventory page
router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.registerInventory)
)

// Processing data for Add Classification page
router.post(
    "/addClassification",
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.registerClassification)
  )

  // Process data to JSON
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON))

// Route to build Edit Inventory page
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

// Process Inventory update to DB
router.post("/update/", 
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory))

router.post("/deleteClass", utilities.handleErrors(invController.deleteClassification))


module.exports = router;