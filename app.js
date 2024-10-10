const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require('path');
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const{listingSchema,reviewSchema}=require("./schema.js");
// const Review=require("./models/review.js");

const listings=require("./Route/listing.js");
const reviews=require("./Route/review.js");

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


app.get("/", (req, res) => {
    res.send("hi,i am root!")
});

//use
app.use("/listing",listings);//require listings from ./Route/listings.js
app.use("/listing/:id/reviews",reviews);//require reviews from ./Route/listings.js

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("Error.ejs",{ message });
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});