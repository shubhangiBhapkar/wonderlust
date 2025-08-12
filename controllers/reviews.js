
module.exports.createReview = async(req,res)=>{
    let RevListing= await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author = req.user._id;
    RevListing.reviews.push(newReview);
 
     await newReview.save();   
     await RevListing.save();
     req.flash("success","revied Saved");
    console.log("new review is saved");
    res.redirect(`/listing/${RevListing.id}`);
    // res.render("listings/show.ejs");
 }

 module.exports.destroyReview = async (req, res) => {
     let { id, reviewId } = req.params;
     await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted");
     res.redirect(`/listing/${id}`); // Change 'listings' to 'listing'
 }