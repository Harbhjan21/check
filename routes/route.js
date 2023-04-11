const User = require("../modles/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const fetch = require("node-fetch");
const Verify = require("./Verify");
const Cart = require("../modles/Cart");
const jwt_secret = "hunny";
const route = express.Router();

route.post("/cartdelete", Verify, async (req, res) => {
  try {
    const id = req.body.id;

    const data = await Cart.findByIdAndDelete(id, { new: true });

    console.log(data);
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(403).json({ success: false, error });
  }
});

route.post("/cartdetail", Verify, async (req, res) => {
  const token = req.headers.token;
  try {
    var decoded = jwt.verify(token, "hunny");
    var userid = decoded.user.id;

    const data = await Cart.find({ userid: userid });

    console.log(data);
    if (data.length != 0) {
      return res.json({ success: true, cart: data });
    }
    res.json({ success: false });
  } catch (error) {
    res.status(403).json({ success: false, error });
  }
});

route.post("/cart", Verify, async (req, res) => {
  const token = req.headers.token;
  try {
    var decoded = jwt.verify(token, "hunny");
    var userid = decoded.user.id;

    var newcart = Cart({
      userid: userid,
      title: req.body.title,
      rating: req.body.rating,
      price: req.body.price,
      image: req.body.image,
      discount: req.body.discount,
      stock: req.body.stock,
    });
    await newcart.save();

    console.log(newcart);
    res.json({ success: true });
  } catch (error) {
    res.status(403).json({ success: false, error });
  }
});

route.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.json({ error: "user already exist" });
    } else {
      console.log("hereF");
      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hash(req.body.password, salt);

      const newuser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashpass,
        PhoneNo: req.body.PhoneNo,
      });
      await newuser.save();

      const payload = {
        user: {
          id: newuser.id,
        },
      };

      const authtok = jwt.sign(payload, jwt_secret);
      res.json({
        authtoken: authtok,
        profile: {
          name: newuser.username,
          email: newuser.email,
          PhoneNo: newuser.PhoneNo,
        },
      });
    }
  } catch (error) {
    res.json({ error });
  }
});
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "invaild credentiols" });
    }

    const bcom = await bcrypt.compare(password, user.password);
    if (!bcom) {
      return res.json({ success: false, error: "invaild credentiols" });
    } else {
      const payload = {
        user: {
          id: user.id,
        },
      };

      const authtok = jwt.sign(payload, jwt_secret);
      res.json({
        authtoken: authtok,
        success: true,
        profile: {
          name: user.username,
          email: user.email,
          PhoneNo: user.PhoneNo,
        },
      });
    }
  } catch (error) {
    res.json({ error });
  }
});
route.patch("/update", async (req, res) => {
  console.log(req.body);
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    { PhoneNo: req.body.no },
    { new: true }
  );
  console.log(user, "hello");

  if (user)
    return res.json({
      success: true,
      profile: {
        name: user.username,
        email: user.email,
        PhoneNo: user.PhoneNo,
      },
    });
  return res.json({ error: "error" });
});

route.get("/product:category", async (req, res) => {
  var cat = req.params.category;
  console.log(cat);
  if (cat != "undefined") {
    cat = "/category/" + cat;
  } else {
    cat = "/";
  }
  const url = "https://dummyjson.com/products" + cat;
  console.log(url);
  try {
    const data = await fetch(url);
    const product = await data.json();
    res.json({ product });
  } catch (error) {
    res.send(error);
  }
});

module.exports = route;
