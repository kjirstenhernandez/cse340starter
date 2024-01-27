// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory with single view
router.get("/detail/:inventoryId", invController.buildVehicleDetails);

// Router for server error messages
router.get("/throwerror", invController.buildError);

module.exports = router;