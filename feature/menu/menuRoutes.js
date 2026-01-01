const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const {getAllMenu} = require("./menuController");

router.use(validateToken);
router.route("/").get(getAllMenu);

module.exports = router;