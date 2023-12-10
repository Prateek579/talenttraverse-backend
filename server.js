const express = require("express");
const cors = require("cors");
const userRouter = require("./router/user");
const connectDb = require("./connection/dataBase");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8031;
connectDb();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", userRouter);
app.get("/", (req, res) => {
    res.send("API IS RUNNING");
});

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`);
});
