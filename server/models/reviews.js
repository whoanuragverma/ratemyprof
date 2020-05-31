const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Review = new Schema({
    FID: {
        type: String,
    },
    name: {
        type: String,
    },
    anonymous: {
        type: Boolean,
        default: false,
    },
    UID: {
        type: String,
    },
    review: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Review", Review);
