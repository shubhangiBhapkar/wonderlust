const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String
    },
    image: {
        filename: { type: String, required: true },
        url: { type: String, required: true }
    },
    price:Number,
    location:String,
    country:String

})
const listing=mongoose.model("listing",listingSchema);

module.exports=listing;