const express = require("express");
const router = express.Router();
const { getUserDetail, createUserDetail, updateUserDetail, getUserDetailById, deleteUserDetail, login, logout, getLoginUserDetail, clearLoginSession, ChangePWD} = require("./userDetailController");
const validateToken = require("../../app/middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getUserDetail);
router.route("/:id").get(getUserDetailById);
router.route("/login_status/:login_id").get(getLoginUserDetail);
router.route("/").post(createUserDetail);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/change_password").post(ChangePWD)
router.route("/clear_login").post(clearLoginSession);
router.route("/:id").put(updateUserDetail);
router.route("/:id").delete(deleteUserDetail);


module.exports = router;
