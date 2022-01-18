const express = require("express");
const router = express.Router();

const siteController = require("../controllers/SiteController");

router.get("/", siteController.indexGET);

router.post("/", siteController.indexPOST);

module.exports = router;
