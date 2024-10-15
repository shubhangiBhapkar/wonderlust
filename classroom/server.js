const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");

app.use(cookieParser());

app.get("/cookies",(req,res)=>{
    res.cookie("greet","namaste");
    res.cookie("madeIn","India");
    res.send("sent you cookie");
})

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi i am root!");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});