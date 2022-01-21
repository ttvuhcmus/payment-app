const express = require("express");
const router = express.Router();

const siteController = require("../controllers/SiteController");

router.get("/", siteController.indexGET);
router.get("/create", siteController.create);
router.get("/manager", siteController.manager);
router.get("/history", siteController.history);
router.get("/changePassword", siteController.password);

router.post("/login", siteController.login);

router.post("/logout", siteController.logout);

router.post("/create", siteController.createUser);
router.post("/balance", siteController.balance);
router.post("/changePassword", siteController.changePassword);

module.exports = router;
