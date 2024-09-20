const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listing");
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))

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

//READ 
app.get("/listing/:id", async(req,res)=>{
    let {id}=req.params;
    const Listing=await listing.findById(id);
    console.log(Listing);
    res.render("listing/show.ejs",{Listing})
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

app.listen(8080,()=>{
    console.log("Listening on port 8080");
})