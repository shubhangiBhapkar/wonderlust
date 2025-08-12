const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListing = await listing.find();
    //console.log(allListing)
    res.render("listings/index.ejs", { allListing });
};

module.exports.newRoute = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id)
    .populate({
        path: "reviews",
        populate: { path: "author" } // populate the review's author
    })
    .populate("owner");
    //console.log(Listing);
    if (!Listing) {
        req.flash("error", "listing Does not exist ");
        res.redirect("/listings");
    };
    console.log(Listing); //printing listing details on console
    res.render("listings/show.ejs", { Listing });
}

module.exports.createListing = async (req, res) => {
    // let {title,description,image,price,country,location}=req.body;
    const newListing = new listing(req.body.Listing)
    newListing.owner = req.user._id;  //passport bydefault stores the curruser 
    await newListing.save();
    req.flash("success", " listing created successfully !");
    //console.log(req.body.listing)
    res.redirect("/listing");

}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    req.flash("success", " listing edited successfully !");
    res.render("listings/edit.ejs", { Listing });
}

module.exports.updateListing = async (req, res) => {
    console.log(req.body); // Log the request body
    let { id } = req.params;
    if (!req.body.Listing) {
        throw new ExpressError(400, "send valid data for listing");
    }
    await listing.findByIdAndUpdate(id, { ...req.body.Listing });
    req.flash("success", "listing updated successfully!");
    res.redirect("/listing");
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const del = await listing.findByIdAndDelete(id);
    req.flash("success", "listing Deleted");
    //console.log(del)
    res.redirect("/listing")
}