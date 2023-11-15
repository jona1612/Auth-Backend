const express = require("express");
const { AuthenticateUser } = require("../controllers/login");
const client = require("../redis");
const router = express.Router();

client
    .connect()
    .then(() => {
        console.log("Connected to Redis");
    })
    .catch((error) => {
        console.log(error);
    })


router.post("/", async (req, res) => {
    try {
        const { email, password } = await req.body;
        const loginCredentials = await AuthenticateUser(email, password);
        console.log(loginCredentials);
        if (loginCredentials === "Invalid User or Password") {
            res.status(200).send("Invalid User or Password");
        } else if (loginCredentials === "Server Busy") {
            res.status(200).send("server Busy");
        } else {
            res.status(200).json({ token: loginCredentials.token });
        }
    } catch (error) {
        console.log(error);

    }
});

module.exports = router;