const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

//Index Route
router.get("/", wrapAsync(listingController.index));

//NEW ROUTE
router.get("/new", isLoggedIn,listingController.newRoute );

//SHOW-ROUTE    
router.get(
    "/:id", 
    wrapAsync(listingController.showListing));

//CREATE-ROUTE
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//EDIT-ROUTE
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing));

//Update route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(listingController.updateListing));


//DELETE-Route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.deleteListing));

module.exports = router;