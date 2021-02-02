/******************************
 *  
 *  API Overview:
 *    - signup          -- POST --      BODY[email,password,name]
 *    - login           -- POST --      BODY[email,password]
 *    - generateOTP     -- GET  --      HEADER[x-access-token]
 *    - validateOTP     -- POST --      BODY[OTP] HEADER[x-access-token]
 *    - find/v1/        -- GET  --      BODY[name]
 *    - verify          -- GET  --      HEADER[x-access-token]
 *    - read_review     -- GET  --      BODY[FID]
 *    - read_rating     -- GET  --      BODY[FID]
 *    - write_review    -- POST --      HEADER[x-access-token] BODY[FID,anonymous,review]
 *    - write_rating    -- POST --      HEADER[x-access-token] BODY[FID,rating]
 *    - check_rating    -- GET  --      HEADER[x-access-token] BODY[FID]
 *    - check_review    -- GET  --      HEADER[x-access-token] BODY[FID]
 ******************************/

const express = require("express");
const router = express.Router();
let User = require("./models/user");
let Prof = require("./models/prof");
let otp = require("./models/otp");
let Reviews = require("./models/reviews");
let Ratings = require("./models/ratings");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const salt = bcrypt.genSaltSync(10);
const sendOTP = require("./mailServer");

router.post("/findUser", (req, res) => {
    const query = req.body.UID;
    User.findById(query)
        .then((result) => {
            return res.json({ name: result.name });
        })
        .catch(() => {
            return res.json({ name: "Smelly Cat" });
        });
});

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
                            return res.status(201).json({
                                message: "SignUp successfull!",
                                code: 1,
                            });
                        })
                        .catch(() => {
                            return res.status(507).json({
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
            return res.status(422).json({ error: errors.array() });
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
                    return res
                        .status(200)
                        .json({ auth: true, token: token, code: 3 });
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
    User.findById(decoded._id)
        .then((result) => {
            const email = result.email;
            if (!result.otpVerified) {
                otp.findOne({ UID: decoded._id }).then((otpRes) => {
                    if (!otpRes) {
                        let otps = new otp({
                            UID: decoded._id,
                            OTP: Math.floor(Math.random() * 8999 + 1000),
                        });
                        otps.save().then(() => {
                            sendOTP(email, otps.OTP);
                            return res.json({ message: "OTP Sent!", code: 1 });
                        });
                    } else {
                        sendOTP(email, otpRes.OTP);
                        return res.json({
                            message: "OTP Sent Again!",
                            code: 2,
                        });
                    }
                });
            } else {
                return res.json({ message: "OTP already verfied!", code: 3 });
            }
        })
        .catch((err) => {
            return res.status(403).json({
                message: "Something's not right.",
                code: 4,
            });
        });
});

router.post("/validateOTP", (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.decode(token);
    const iOTP = req.body.OTP;
    otp.findOne({ UID: decoded._id })
        .then((result) => {
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
        })
        .catch((err) => {
            return res.status(403).json({
                message: "Something's not right.",
                code: 4,
            });
        });
});

router.post("/find/v1", (req, res) => {
    let query = req.body.name + ".*";
    Prof.find({ name: { $regex: query, $options: "i" } })
        .limit(10)
        .then((result) => {
            return res.json(result);
        });
});
router.post("/find/v2", (req, res) => {
    Prof.find({ FID: req.body.FID }).then((result) => {
        return res.json(result);
    });
});

router.get("/verify", (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(409).json({ code: 0, message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(409).json({ response: false });
        } else {
            return res.status(200).json({ response: true, decoded });
        }
    });
});

router.post("/read_review", (req, res) => {
    const FID = req.body.FID;
    if (!FID) {
        return res.status(200).json({ code: 3, message: "FID not Supplied" });
    }
    Prof.findOne({ FID: FID }).then(() => {
        Reviews.find({ FID: FID }).then((result) => {
            return res.status(200).json(result);
        });
    });
});

router.post("/read_rating", (req, res) => {
    const FID = req.body.FID;
    if (!FID) {
        return res.status(200).json({ code: 3, message: "FID not Supplied" });
    }
    Prof.findOne({ FID: FID }).then(() => {
        Ratings.find({ FID: FID }).then((result) => {
            return res.status(200).json(result);
        });
    });
});

router.post("/write_review", (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(409).json({ code: 0, message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(409).json({ code: 1, message: "Unauthorized" });
        } else {
            const UID = decoded._id;
            const FID = req.body.FID;
            const name = decoded._name;
            const anonymous = req.body.anonymous;
            const review = req.body.review;
            let Review = new Reviews({
                UID: UID,
                FID: FID,
                name: name,
                anonymous: anonymous,
                review: review,
            });
            Review.save()
                .then(() => {
                    return res.json({ code: 2, message: "Success" });
                })
                .catch(() => {
                    return res.json({
                        code: 3,
                        message: "Something went wrong",
                    });
                });
        }
    });
});

router.post("/write_rating", (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(409).json({ code: 0, message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(409).json({ code: 1, message: "Unauthorized" });
        } else {
            const UID = decoded._id;
            const FID = req.body.FID;
            const rating = req.body.rating;
            let Rating = new Ratings({
                UID: UID,
                FID: FID,
                rating: rating,
            });
            Rating.save()
                .then(() => {
                    return res.json({ code: 2, message: "Success" });
                })
                .catch(() => {
                    return res.json({
                        code: 3,
                        message: "Something went wrong",
                    });
                });
        }
    });
});

router.post("/check_rating", (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(409).json({ code: 0, message: "Unauthorized" });
    }
    const decoded = jwt.decode(token);
    const FID = req.body.FID;
    Ratings.find({ UID: decoded._id, FID: FID }).then((result) => {
        if (result.length == 0) {
            return res.json({ response: true });
        }
        return res.json({ response: false });
    });
});

router.post("/check_review", (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(409).json({ code: 0, message: "Unauthorized" });
    }
    const decoded = jwt.decode(token);
    const FID = req.body.FID;
    Reviews.find({ UID: decoded._id, FID: FID }).then((result) => {
        if (result.length == 0) {
            return res.json({ response: true });
        }
        return res.json({ response: false });
    });
});

module.exports = router;
