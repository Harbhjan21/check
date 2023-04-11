const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./modles/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const cors = require("cors");

const jwt_secret = "hunnysingh";

mongoose.connect("mongodb://localhost:27017/hunny", () => {
  console.log("connected to mongodb");
});
const app = express();

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

app.use("/auth", require("./routes/route"));

app.listen(3030, (err) => {
  if (!err) console.log("server is listning at port 3030");
});
