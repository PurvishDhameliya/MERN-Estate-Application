const express = require("express");
const {
  userController,
  updateUserInfoController,
  deleteUserInfoController,
} = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyUser");
const router = express.Router();

router.get("/test", userController);
router.post("/update/:id", verifyToken, updateUserInfoController);
router.delete("/delete/:id", verifyToken, deleteUserInfoController);

module.exports = router;
