const mongoose=require("mongoose");
const listing=require("../models/listing.js");
const initData=require("./data.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
main().then(()=>{
    console.log("connected");
})
.catch(err=>console.log(err));

async function main(){ 
await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("data is initialized");
}

initDb();
