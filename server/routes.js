const express = require("express");
const router = express.Router();
let User = require("./models/user");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);

router.post(
  "/signup",
  [
    check("email", "Invalid Email").isEmail(),
    check("password", "Password must be atleast 6 characters long.").isLength({
      min: 6,
    }),
    check("name", "Name is required").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }
    User.find({ email: req.body.email })
      .then((result) => {
        if (result.length != 0) {
          return res.status(409).json({ message: "Email already exists!" });
        } else {
          const hashedPassword = bcrypt.hashSync(req.body.password);
          let user = new User(req.body);
          user.password = hashedPassword;
          user
            .save()
            .then(() => {
              res.status(201).json({ message: "SignUp successfull!" });
            })
            .catch(() => {
              res.status(507).json({ message: "Something went wrong!" });
            });
        }
      })
      .catch(() => {
        return res
          .status(500)
          .json({ message: "Something went wrong on our side" });
      });
  }
);

router.post(
  "/login",
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Password is required!").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ error: errors.array() });
    }
    User.find({ email: req.body.email }).then((result) => {
      if (result.length == 0) {
        return res
          .status(409)
          .json({ auth: false, message: "Email not registered!" });
      } else {
        if (!bcrypt.compareSync(req.body.password, result[0].password)) {
          return res
            .status(403)
            .json({ auth: false, message: "Invalid Password!" });
        } else {
          const token = jwt.sign(
            { _id: result[0]._id, name: result[0].name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          res.status(200).json({ auth: true, token: token });
        }
      }
    });
  }
);

router.get("/verify", (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    res.json(decoded);
  });
});
module.exports = router;
