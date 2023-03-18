const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./modles/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const cors = require("cors");

const jwt_secret = "hunny";

mongoose.connect("mongodb://localhost:27017/hunny", () => {
  console.log("connected to mongodb");
});
const app = express();

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

app.post("/auth/signup", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.json("user already exist");
    }
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(req.body.password, salt);

    const newuser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashpass,
    });

    const payload = {
      user: {
        id: newuser.id,
      },
    };

    const authtok = jwt.sign(payload, jwt_secret);
    res.json(authtok);
  } catch (error) {
    res.json(error);
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: "invaild credentiols" });
    }
    const bcom = bcrypt.compare(password, user.password);
    if (!bcom) {
      res.json({ error: "invaild credentiols" });
    } else {
      const payload = {
        user: {
          id: user.id,
        },
      };
      const authtok = jwt.sign(payload, jwt_secret);
      res.json(authtok);
    }
  } catch (error) {
    res.json(error);
  }
});

app.listen(3030, (err) => {
  if (!err) console.log("server is listning at port 3030");
});
