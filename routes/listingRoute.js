const express = require("express");
const { createListingController } = require("../controllers/listingController");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.post("/create", verifyToken, createListingController);

module.exports = router;
