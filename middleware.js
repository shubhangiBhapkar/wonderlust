module.exports.isLoggedIn = (req , res , next ) => {
    if(!req.isAuthenticated()){
        req.flash("error"," Do Login/signup first");
        return res.redirect("login.ejs");
     }
     next();
}

