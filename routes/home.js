const express = require("express");
const { AuthorizeUser } = require("../controllers/login");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const auth_token = await req.headers.authorization;
        const loginCredentials = AuthorizeUser(auth_token);
        if (loginCredentials===false) {
            res.status(200).send("Invalid Token")
        } else {
            res.json(loginCredentials);
        }
    } catch (error) {
        console.log(error);
        res.status(400).sen("Server Busy");
    }
});

module.exports = router;