const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Prof = new Schema({
    FID: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    designation: {
        type: String,
    },
    department: {
        type: String,
    },
    school: {
        type: String,
    },
    cabin: {
        type: String,
    },
    image: {
        type: String,
    },
});

module.exports = mongoose.model("Prof", Prof);
