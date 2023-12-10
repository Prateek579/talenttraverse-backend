const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose
    .connect(process.env.STRING)
    .then(() => {
      console.log("Connected to DB successfully");
    })
    .catch((error) => {
      console.log("falied to connect with DB", error);
    });
};
module.exports = connectDb;
