const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { 
    getApplog,
} = require("./appLogHistoryController");

router.use(validateToken);
router.route("/").post(getApplog);

module.exports = router;