const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { getAllSchedules, createSchedule, updateSchedule, deleteSchedule } = require("./scheduleController");

router.use(validateToken);
router.route("/").get(getAllSchedules);
router.route("/").post(createSchedule);
router.route("/:id").put(updateSchedule);
router.route("/:id").delete(deleteSchedule);

module.exports = router;