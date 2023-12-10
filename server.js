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
app.use("/", (req, res) => {
  res.status(200).json({ message: "app is running successfully" });
});
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`);
});

// const { spawn } = require("child_process");

// const childPython = spawn("python", ["ScrapData.py", "prateek"]);

// let jobDetails = "";

// childPython.stdout.on("data", (data) => {
//   console.log(`stdout: ${data}`);
//   jobDetails += data;
//   console.log("copy data is", jobDetails);
// });

// childPython.stderr.on("data", (data) => {
//   console.log(`stderr: ${data}`);
// });

// childPython.on("close", (code) => {
//   console.log(`child process exit with code ${code}`);
// });
