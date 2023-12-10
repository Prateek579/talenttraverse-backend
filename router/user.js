const express = require("express");
const { createUser, loginUser, sendCode, resetPassword } = require("../controller/userController");

const userRouter = express.Router();

userRouter.post("/createNewUser", createUser);
userRouter.post("/loginUser", loginUser);
userRouter.post("/sendCode", sendCode)
userRouter.put("/resetPassword", resetPassword)


module.exports = userRouter;
