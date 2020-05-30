const express = require("express");
const router = express.Router();
let User = require("./models/user");
let Prof = require("./models/prof");
let otp = require("./models/otp");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const salt = bcrypt.genSaltSync(10);
const sendEMail = require("./mailServer");
router.post(
    "/signup",
    [
        check("email", "Invalid Email").isEmail(),
        check(
            "password",
            "Password must be atleast 6 characters long."
        ).isLength({
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
                    return res
                        .status(409)
                        .json({ message: "Email already exists!", code: 0 });
                } else {
                    const hashedPassword = bcrypt.hashSync(
                        req.body.password,
                        salt
                    );
                    let user = new User(req.body);
                    user.password = hashedPassword;
                    user.save()
                        .then(() => {
                            res.status(201).json({
                                message: "SignUp successfull!",
                                code: 1,
                            });
                        })
                        .catch(() => {
                            res.status(507).json({
                                message: "Something went wrong!",
                            });
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
                return res.status(409).json({
                    auth: false,
                    message: "Email not registered!",
                    code: 0,
                });
            } else {
                if (
                    !bcrypt.compareSync(req.body.password, result[0].password)
                ) {
                    return res.status(403).json({
                        auth: false,
                        message: "Invalid Password!",
                        code: 1,
                    });
                } else {
                    const token = jwt.sign(
                        { _id: result[0]._id, name: result[0].name },
                        process.env.JWT_SECRET,
                        { expiresIn: "7d" }
                    );
                    if (!result[0].otpVerified) {
                        return res.status(201).json({
                            auth: "pending",
                            token: token,
                            code: 2,
                        });
                    }
                    res.status(200).json({ auth: true, token: token, code: 3 });
                }
            }
        });
    }
);

router.get("/generateOTP", (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.decode(token);
    User.findById(decoded._id).then((result) => {
        const email = result.email;
        if (!result.otpVerified) {
            otp.findOne({ UID: decoded._id }).then((otpRes) => {
                if (!otpRes) {
                    let otps = new otp({
                        UID: decoded._id,
                        OTP: Math.floor(Math.random() * 8999 + 1000),
                    });
                    otps.save().then(() => {
                        sendEMail(email, otps.OTP);
                        res.json({ message: "OTP Sent!", code: 1 });
                    });
                } else {
                    sendEMail(email, otpRes.OTP);
                    res.json({ message: "OTP Sent Again!", code: 2 });
                }
            });
        } else {
            res.json({ message: "OTP already verfied!", code: 3 });
        }
    });
});

router.post("/validateOTP", (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.decode(token);
    const iOTP = req.body.OTP;
    otp.findOne({ UID: decoded._id }).then((result) => {
        if (iOTP == result.OTP) {
            User.findByIdAndUpdate(decoded._id, { otpVerified: true }).then(
                () => {
                    return res.json({
                        message: "Success",
                        code: 0,
                        auth: true,
                    });
                }
            );
        } else {
            return res.json({
                message: "Invalid OTP",
                code: 1,
                auth: "pending",
            });
        }
    });
});

router.get("/find/v1", (req, res) => {
    let query = req.body.name + ".*";
    Prof.find({ name: { $regex: query, $options: "i" } })
        .limit(10)
        .then((result) => {
            res.json(result);
        });
});

/*  Routes remaining
    1. Write review - requires auth
    2. Read review - requires auth
    3. Give rating
    4. Read rating 
*/
module.exports = router;
