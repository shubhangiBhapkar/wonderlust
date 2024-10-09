const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");


app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
main().then(() => {
    console.log("connected");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Schema validation middleware - this middleware only use for POST and PUT request
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//Index Route
app.get("/listing", wrapAsync(async (req, res) => {
    const allListing = await listing.find();
    //console.log(allListing)
    res.render("listings/index.ejs", {allListing });
}));

//NEW ROUTE
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs");
})

//SHOW-ROUTE    
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const Listing = await listing.findById(id).populate("reviews");
    //console.log(Listing);
    res.render("listings/show.ejs", { Listing });
}));

//CREATE-ROUTE
app.post("/listing",validateListing,wrapAsync(async (req,res) => {
    // let {title,description,image,price,country,location}=req.body;
    const newListing = new listing(req.body.Listing) 
    await newListing.save();
    //console.log(req.body.listing)
    res.redirect("/listing");
}));

//EDIT-ROUTE
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("listings/edit.ejs", { Listing });
}));


//UPDATE-ROUTE
// app.put("/listing/:id",validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     if(!req.body.Listing){
//         throw new ExpressError(400,"send valid data for listing")
//     }
//     await listing.findByIdAndUpdate(id, { ...req.body.Listing });
//     res.redirect("/listing");
// }))


app.put("/listing/:id",validateListing,wrapAsync(async (req, res) => {
    console.log(req.body); // Log the request body
    let { id } = req.params;
    if (!req.body.Listing) {
        throw new ExpressError(400, "send valid data for listing");
    }
    await listing.findByIdAndUpdate(id, { ...req.body.Listing });
    res.redirect("/listing");
}));


//DELETE-Route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const del = await listing.findByIdAndDelete(id);
    console.log(del)
    res.redirect("/listing")
}));

// Reviews
// POST Route
app.post("/listing/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
   let RevListing= await listing.findById(req.params.id);
   let newReview=new Review(req.body.review);

   RevListing.reviews.push(newReview);

    await newReview.save();   
    await RevListing.save();

   console.log("new review is saved");
   res.render("listings/show.ejs");
}));

//Delete Review Route
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`); // Change 'listings' to 'listing'
}));


// app.get("/test",async(req,res)=>{
//    const sampleListing=new listing({
//     title:"shubhangis house",
//     description:"its a new house ,with swimming pool",
//     price:12000000,
//     location:"Ahmednagar",
//     country:"India"
//    })
//    await sampleListing.save();
//    console.log("saved sample");
//    res.send("saved")
// })

app.get("/", (req, res) => {
    res.send("hi,working")
})

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"))
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("listings/Error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});