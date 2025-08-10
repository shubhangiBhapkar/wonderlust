const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");


//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await listing.find();
    //console.log(allListing)
    res.render("listings/index.ejs", { allListing });
}));

//NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//SHOW-ROUTE    
router.get(
    "/:id", 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id)
    .populate("reviews")
    .populate("owner");
    //console.log(Listing);
    if (!Listing) {
        req.flash("error", "listing Does not exist ");
        res.redirect("/listings");
    };
    console.log(Listing); //printing listing details on console
    res.render("listings/show.ejs", { Listing });
}));

//CREATE-ROUTE
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    // let {title,description,image,price,country,location}=req.body;
    const newListing = new listing(req.body.Listing)
    newListing.owner = req.user._id;  //passport bydefault stores the curruser 
    await newListing.save();
    req.flash("success", " listing created successfully !");
    //console.log(req.body.listing)
    res.redirect("/listing");

}));

//EDIT-ROUTE
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner, 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    req.flash("success", " listing edited successfully !");
    res.render("listings/edit.ejs", { Listing });
}));

//Update route
router.put("/:id",
    isLoggedIn,  
    isOwner,
    validateListing, 
    wrapAsync(async (req, res) => {
    console.log(req.body); // Log the request body
    let { id } = req.params;
    if (!req.body.Listing) {
        throw new ExpressError(400, "send valid data for listing");
    }
    await listing.findByIdAndUpdate(id, { ...req.body.Listing });
    req.flash("success", "listing updated successfully!");
    res.redirect("/listing");
}));


//DELETE-Route
router.delete("/:id",
    isLoggedIn, 
    isOwner,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const del = await listing.findByIdAndDelete(id);
    req.flash("success", "listing Deleted");
    //console.log(del)
    res.redirect("/listing")
}));

module.exports = router;