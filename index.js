const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const api = require("./server/routes");
const app = express();
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use(cors());
app.use("/api", api);

mongoose.connect(process.env.MONGODB_CRED, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB connection successfull");
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
