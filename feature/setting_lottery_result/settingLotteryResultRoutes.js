const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { getAllLotteryResults, createLotteryResult, updateLotteryResult, deleteLotteryResult } = require("./settingLotteryResultController");

router.use(validateToken);
router.route("/").get(getAllLotteryResults);
router.route("/").post(createLotteryResult);
router.route("/:id").put(updateLotteryResult);
router.route("/:id").delete(deleteLotteryResult);

module.exports = router;