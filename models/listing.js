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
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/1136231694/photo/family-with-three-year-old-boy-on-beach.jpg?s=1024x1024&w=is&k=20&c=QQu7gp2YBlJvW9nmGF6SiXDjtF6d_YR9ogRSxVvU1r0=",
        set:(v)=> v ===""?"https://media.istockphoto.com/id/1136231694/photo/family-with-three-year-old-boy-on-beach.jpg?s=1024x1024&w=is&k=20&c=QQu7gp2YBlJvW9nmGF6SiXDjtF6d_YR9ogRSxVvU1r0="
        :v
    },
    price:Number,
    location:String,
    country:String

})
const listing=mongoose.model("listing",listingSchema);

module.exports=listing;