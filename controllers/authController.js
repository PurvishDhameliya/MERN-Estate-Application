const User = require("../models/userModel");
const errorHandler = require("../utils/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//signup
const signupController = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    // required fields
    if (!email || !password) {
      return next(errorHandler(400, "Email and password are required"));
    }
    // find one unique user email
    const userExist = await User.findOne({ email });

    // check userExisted or not
    if (userExist) {
      return next(errorHandler(409, "User already exists"));
    }

    // bcrypt hashing password
    const hashedPassword = bcrypt.hashSync(password, 12);

    // hashpass insert into our user
    const user = new User({ username, email, password: hashedPassword });

    // save user
    await user.save();

    // res message :)
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//login api
const signinController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // find email unique
    const validUser = await User.findOne({ email });
    // check user valid or not
    if (!validUser) {
      return next(errorHandler(404, "User Not Found"));
    }
    // compare password with bcrypt in signup hashSync
    const validPassword = bcrypt.compareSync(password, validUser.password);
    // check passowrd valid or not
    if (!validPassword) {
      return next(errorHandler(401, "Wrong Credentials"));
    }
    // give token from jsonwebtoken
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // desturcture password from validUser for password as it is in db
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//google signin handler controller
const GooglesigninController = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOne: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = brcyt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOne: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signupController,
  signinController,
  GooglesigninController,
};
