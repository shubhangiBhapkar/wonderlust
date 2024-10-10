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

const listings=require("./Route/listing.js");

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

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


//UPDATE-ROUTE
// app.put("/listing/:id",validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     if(!req.body.Listing){
//         throw new ExpressError(400,"send valid data for listing")
//     }
//     await listing.findByIdAndUpdate(id, { ...req.body.Listing });
//     res.redirect("/listing");
// }))


app.use("/listing",listings);//require listings from ./Route/listings.js


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