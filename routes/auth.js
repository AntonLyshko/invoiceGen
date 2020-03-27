const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");

// Get user
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Log-In user
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  let login = email;
  try {
    let user = await User.findOne({ login });

    if (!user) {
      return res.status(400).json({
        error: [
          {
            msg: "Wrong login"
          }
        ]
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("password failed");
      return res.status(400).json({
        error: [
          {
            msg: "Wrong password"
          }
        ]
      });
    }
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 360000
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
