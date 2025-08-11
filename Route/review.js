const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const listing = require("../models/listing.js");
const Review=require("../models/review.js");
const{isLoggedIn} = require("../middleware.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


// POST Route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync
    (async(req,res)=>{
    let RevListing= await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author = req.user._id;
    RevListing.reviews.push(newReview);
 
     await newReview.save();   
     await RevListing.save();
     req.flash("success","revied Saved");
    console.log("new review is saved");
    res.redirect(`/listing/${RevListing.id}`);
    // res.render("listings/show.ejs");
 }));
 
 //Delete Review Route
 router.delete("/:reviewId",
     wrapAsync(async (req, res) => {
     let { id, reviewId } = req.params;
     await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted");
     res.redirect(`/listing/${id}`); // Change 'listings' to 'listing'
 }));
 
 module.exports=router;