const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");

router.get("/signup", (req, res) => {
   res.render("users/signup.ejs")
});


router.post("/signup", async (req, res) => {
   try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });

      let registerUser = await User.register(newUser, password);
      req.flash("success", "Welcome to wanderlust!");
      res.redirect("/listing");

   } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
   }
});
module.exports = router;