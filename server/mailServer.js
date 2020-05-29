const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
    },
});

function sendEmail(email, otp) {
    var mailOptions = {
        from: "RateMyProf Team",
        to: email,
        subject: "RateMyProf Verification",
        html:
            "Hi,<br><br> Here is your OTP for completing sign up for RateMyProf<h2>" +
            otp +
            `</h2>This was an additional step to prevent other users from spam.<br>
            This OTP is valid only for <b>15 minutes</b>.<br><br>Thanks<br>The RateMyProf Team`,
    };
    transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
