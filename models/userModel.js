const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
        type: String,
        required: true,
      },
    avatar:{
      type :String ,
      default:'https://winaero.com/blog/wp-content/uploads/2018/08/Windows-10-user-icon-big.png' 

    }  
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
