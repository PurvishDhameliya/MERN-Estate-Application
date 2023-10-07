const User = require("../models/userModel");

const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!req.body || !req.body.email || req.body.password === "")
      throw new Error("Missing required fields");
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) throw new Error("User already exists");
    const user = new User({ username, email, password });
  } catch (error) {
    return res.status(500).json({
      msg: "signup error",
    });
  }
};

module.exports = {
  signupController,
};
