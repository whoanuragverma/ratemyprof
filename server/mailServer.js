const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const refresh_token = process.env.refresh_token;
const email = process.env.email;
const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: refresh_token,
});

const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: email,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refresh_token,
        accessToken: accessToken,
    },
});

module.exports = function (email, otp) {
    const mailOptions = {
        from: "RateMyProf Team",
        to: email,
        generateTextFromHTML: true,
        subject: "RateMyProf Verification",
        html:
            "Hi,<br><br> Here is your OTP for completing sign up for RateMyProf<h2>" +
            otp +
            `</h2>This was an additional step to prevent other users from spam.<br>
            This OTP is valid only for <b>15 minutes</b>.<br><br>Thanks<br>The RateMyProf Team`,
    };

    transporter.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
};
