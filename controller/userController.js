const User = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

//creating a new user using POST method /api/user/createUser
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are mendatory" });
  } else {
    //checking for user already exist or not
    const userExist = await User.findOne({ email });
    if (!userExist) {
      //hashing password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 7);
      try {
        const create = await User.create({
          name,
          email,
          password: hashedPassword,
        });
        const data = {
          id: create.id,
        };
        //returnign json web token in respose
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.status(200).json({
          message: "New user created successfully",
          authToken,
          success: true,
        });
      } catch (error) {
        res
          .status(400)
          .json({ message: "user creating internal server error" });
      }
    } else {
      res.status(400).json({ message: "User already exist with this email" });
    }
  }
};

//login a new user using POST method /api/user/loginUser
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are mendatory" });
  } else {
    // checking for user exist or not
    const userExist = await User.findOne({ email });
    if (userExist) {
      // comparing the user input password and data base password
      const isCorrectPassword = await bcrypt.compare(
        password,
        userExist.password
      );
      if (isCorrectPassword) {
        const data = {
          id: userExist.id,
        };
        // returning a json web token to logined user
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.status(200).json({
          message: "User login successfully",
          authToken,
          success: true,
          name: userExist.name,
        });
      } else {
        res.status(400).json({
          message: "Please enter with right credentials",
          success: false,
        });
      }
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  }
};

// sending a reset code on email address using POST method /api/user/sendCode
const sendCode = async (req, res) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    const passwordCode = Math.floor(Math.random() * 10000) + 1;

    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Talent-Traverse",
        link: "https://mailgen.js",
      },
    });

    let response = {
      body: {
        name: "",
        intro: userExist.name,
        table: {
          data: [
            {
              discription: "Reset password code for Talent-Traverse",
              code: passwordCode,
            },
          ],
        },
        outro: "Thankyou for a part of Talent-Traverse",
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: mail,
    };

    transporter
      .sendMail(message)
      .then(() => {
        return res
          .status(201)
          .json({ message: "Code is send", code: passwordCode, success: true });
      })
      .catch((error) => {
        return res.status(500).json({ success: true, error });
      });
  } else {
    return res.status(200).json({ message: "User does not exist" });
  }
};

//updating the password using PUT method /api/user/resetPassword
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).json({ message: "Not sended email or reset password" });
  } else {
    const userExist = await User.findOne({ email });
    if (userExist) {
      const _id = userExist._id;
      const hashedPassword = await bcrypt.hash(password, 7);
      try {
        const update = await User.findByIdAndUpdate(
          { _id },
          { password: hashedPassword }
        );
        res
          .status(200)
          .json({ message: "Password updated successfully", success: true, name: userExist.name });
      } catch (error) {
        res
          .status(400)
          .json({ message: "Reset password internal server error" });
      }
    } else {
      res.status(400).json({ message: "User does not exist with this email" });
    }
  }
};

module.exports = { createUser, loginUser, sendCode, resetPassword };
