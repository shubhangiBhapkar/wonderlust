const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require('path');
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
// const{listingSchema,reviewSchema}=require("./schema.js");
// const Review=require("./models/review.js");

const listings=require("./Route/listing.js");
const reviews=require("./Route/review.js");
const flash=require("connect-flash");

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions={
    secret:"mysupersecretecode",
    resave:false,
    saveUninitialized:true,
    cookie :{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};

app.get("/", (req, res) => {
    res.send("hi,i am root!")
});


app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    next();
});

MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
main().then(() => {
    console.log("connected");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

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