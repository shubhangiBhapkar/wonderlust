const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing");
const path = require('path');
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
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
    const Listing = await listing.findById(id);
    //console.log(Listing);
    res.render("listings/show.ejs", { Listing })
}));

//CREATE-ROUTE
app.post("/listing", wrapAsync(async (req, res, next) => {
    // let {title,description,image,price,country,location}=req.body;
    if(!req.body.Listing){
        throw new ExpressError(400,"send valid data for listing")
    }
    const newListing = new listing(req.body.Listing)
    await newListing.save();
    //console.log(req.body.listing)
    res.redirect("/listing");
}));

//EDIT-ROUTE
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    // console.log(Listing)
    res.render("listings/edit.ejs", { Listing });
}))

//UPDATE-ROUTE
app.put("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    if(!req.body.Listing){
        throw new ExpressError(400,"send valid data for listing")
    }
    await listing.findByIdAndUpdate(id, { ...req.body.Listing });
    res.redirect("/listing");
}))

//DELETE-Route
app.post("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const del = await listing.findByIdAndDelete(id);
    console.log(del)
    res.redirect("/listing")
}))

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
})
app.use((err, req, res, next) => {
    let{statusCode=500,message="Something went Wrong!"}=err;
    res.render("listings/Error.ejs",{message});
    // res.status(statusCode).send(message);
    
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
})