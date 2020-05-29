const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Otp = new Schema({
    UID: {
        type: String,
    },
    OTP: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
        expires: 900,
    },
});

module.exports = mongoose.model("Otp", Otp);
