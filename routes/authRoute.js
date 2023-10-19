const express = require("express");
const {
  signupController,
  signinController,
  GooglesigninController,
  signoutController,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/google", GooglesigninController);
router.get('/signout', signoutController)
module.exports = router;
