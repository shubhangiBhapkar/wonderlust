const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
   res.render("users/signup.ejs")
});


router.post("/signup", async (req, res) => {
   try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      let registerUser = await User.register(newUser, password);
      req.login(registerUser,(err)=>{
         if(err){
         return next(err);
         }
         req.flash("success", "Welcome to wanderlust!");
         res.redirect("/listing");
      });
   } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
   }
});

//Login

router.get("/login", async (req, res) => {
   res.render("users/login.ejs")

});

router.post(
   "/login",
   passport.authenticate("local", {
      failureRedirect:"/login",
      failureFlash: true,
   }),
async (req, res) => {
      req.flash("success","Welcome back to Wanderlust!");
      res.redirect("/listing");
   });

router.get("/logout",(req,res,next)=>{
   req.logout((err)=>{
      if(err){
       return next(err);
      }
      req.flash("success","You are logged out");
      res.redirect("/listing");
   })
})

module.exports = router;