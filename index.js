const express = require("express");
const connectDb = require("./db");
const cors = require("cors");
const signupRouter = require('./routes/signup');
const loginRouter = require("./routes/login");
const homeRouter = require("./routes/home");
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({orgin:'*'}))
connectDb();


app.get("/", (req, res) => {
    res.send("Hello");
});


app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);

app.listen(port, () => {
    console.log(`Port is running on ${port}`);
});