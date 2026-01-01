const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { 
    getAppSetting,
    updateAppSetting
} = require("./appSettingController");

router.use(validateToken);
router.route("/").get(getAppSetting);
router.route("/").post(updateAppSetting);

module.exports = router;