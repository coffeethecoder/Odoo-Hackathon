const express = require("express");

const router = express.Router();

const assetsController = require("../controllers/assets.controller");

router.get("/", assetsController.getAssets);
router.post("/", assetsController.registerAsset);

module.exports = router;