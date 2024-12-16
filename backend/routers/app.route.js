const express = require("express");
const { getAppData } = require("../controllers/app.controller");

const router = express.Router();

router.get("/", getAppData);

module.exports = router;
