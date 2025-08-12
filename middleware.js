
module.exports.isLoggedIn = (req , res , next ) => {
    if(!req.isAuthenticated()){
        console.log(req.originalUrl);
        req.session.redirectUrl=req.originalUrl;
        req.flash("error"," Do Login/signup first");
        return res.redirect("/login");
     }
     next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}