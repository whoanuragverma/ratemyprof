const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Rating = new Schema({
    FID: {
        type: String,
    },
    UID: {
        type: String,
    },
    rating: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Rating", Rating);
