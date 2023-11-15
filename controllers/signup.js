const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const verifyUser = require("../models/verifyUser");
const { sendMail } = require("./Sendmail");


async function InsertVerifyUser(name, email, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const token = generateToken(email);

        const newUser = new verifyUser({
            name: name,
            email: email,
            password: hashedPassword,
            token: token,
        });

        const activationLink = `http://localhost:5000/signup/${token}`;
        const content = `<h4>Hi, there</h4>
        <h5>Welcome to the app</h5>
        <p>Thank you for signing up. click on the below link to activate</p>
        <a href="${activationLink}">Click Here</a>
        <p>Regards</p>
        <p>Team</p>`

        await newUser.save();
        sendMail(email, "verifyUser", content);

    } catch (error) {
        console.log(error);
    }
};

function generateToken(email) {
    const token = jwt.sign(email, process.env.signup_secret_token);
    return token;
}

async function InsertSignupUser(token) {
    try {
        const userVerify = await verifyUser.findOne({ token: token });
        if (userVerify) {
            const newUser = new User({
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
                forgotPassword: {}
            })
            await newUser.save();
            await userVerify.deleteOne({ token: token });
            const content = `<h4>Registration Successfull</h4>
        <h5>Welcome to the app</h5>
        <p>You are successfully registered</p>  
        <p>Regards</p>
        <p>Team</p>`;
            sendMail(newUser.email, "Registration Successful", content);
            return `<h4>Hi, there</h4>
        <h5>Welcome to the app</h5>
        <p>You are successfully registered</p>  
        <p>Regards</p>
        <p>Team</p>`;
        }
        return `<h4>Registration Failed</h4>
        <p>Link Expired....</p>  
        <p>Regards</p>
        <p>Team</p>`;
    } catch (error) {
        console.log(error);
        retrun `<html>
        <body>
        <h4>Registration Failed</h4>
        <p>Unexpeted error happenned....</p>  
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>`;
    }
}

module.exports = { InsertVerifyUser, InsertSignupUser };