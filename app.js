const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listing");
const path = require('path');
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
main().then(()=>{
    console.log("connected");
})
.catch(err=>console.log(err));

async function main(){
   await mongoose.connect(MONGO_URL);
}
//Index Route
app.get("/listing",async(req,res)=>{
    const allListing=await listing.find();
    //console.log(allListing)
    res.render('listings/index',{allListing});  
})

//NEW ROUTE
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//SHOW-ROUTE    
app.get("/listing/:id", async(req,res)=>{
    let {id}=req.params;
    const Listing=await listing.findById(id);
    //console.log(Listing);
    res.render("listings/show.ejs",{Listing})
})

//CREATE-ROUTE
app.post("/listing",async (req,res,next)=>{
    try{
        // let {title,description,image,price,country,location}=req.body;
     const newListing=new listing(req.body.Listing) 
     await newListing.save();
     //console.log(req.body.listing)
     res.redirect('/listing');
    }catch(err){
        next(err);
    }
 });

 //EDIT-ROUTE
app.get("/listing/:id/edit",async(req,res)=>{
    try{
        let {id}=req.params;
    const Listing=await listing.findById(id);
   // console.log(Listing)
    res.render("listings/edit",{Listing});
    }catch(err){
        next(err);
    }
})

//UPDATE-ROUTE
app.put("/listing/:id", async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect("/listing");
})

//DELETE-SRoute
app.post("/listing/:id", async (req,res)=>{
    let {id}=req.params;
    const del=await listing.findByIdAndDelete(id);
    console.log(del)
    res.redirect("/listing")
})
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

app.get("/",(req,res)=>{
    res.send("hi,working")
})

app.use((err,req,res,next)=>{
    res.send("Something Went Wrong!");
})
app.listen(8080,()=>{
    console.log("Listening on port 8080");
})