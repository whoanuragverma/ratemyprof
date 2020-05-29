const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    otpVerified: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("User", User);
