const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const listing = require("../models/listing.js");
const Review=require("../models/review.js");
const{isLoggedIn,validateReview} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")


// POST Route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync
    (reviewController.createReview));
 
 //Delete Review Route
 router.delete("/:reviewId",
     wrapAsync(reviewController.destroyReview));
 
 module.exports=router;