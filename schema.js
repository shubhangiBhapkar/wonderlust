 const Joi = require('joi');
const listing = require("./models/listing.js");

// module.exports.listingSchema=Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         country: Joi.string().required(),
//         location: Joi.string().required(),
//         image: Joi.string().allow("", null)
//     }).required()
// });

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().allow("", null)
});
