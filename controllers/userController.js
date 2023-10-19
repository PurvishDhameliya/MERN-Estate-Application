const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error");
const userController = (req, res) => {
  return res.json({
    message: "hello",
  });
};

//user info update
const updateUserInfoController = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    next(errorHandler(401, "you can only update your account!"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).send(rest);
  } catch (error) {
    next(error);
  }
};

//user delete info

const deleteUserInfoController = async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return next(errorHandler(401, "you can only delete your account!"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted..");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userController,
  updateUserInfoController,
  deleteUserInfoController,
};
