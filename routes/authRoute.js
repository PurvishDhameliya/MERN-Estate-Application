const express = require("express");
const {
  signupController,
  signinController,
  GooglesigninController,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/google", GooglesigninController);


module.exports = router;
