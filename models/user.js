const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// Add passport-local-mongoose plugin to the schema
userSchema.plugin(passportLocalMongoose);

// Export the model correctly by passing the schema object (userSchema) instead of a string
module.exports = mongoose.model("User", userSchema);
