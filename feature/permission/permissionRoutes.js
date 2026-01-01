const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { getAllPermissionDetail, getPermissionDetailById, updatePermissionDetail, createPermissionDetail, deletePermissionDetail } = require("./permissionController");

router.use(validateToken);
router.route("/").get(getAllPermissionDetail);
router.route("/:id").get(getPermissionDetailById);
router.route("/:id").put(updatePermissionDetail);
router.route("/").post(createPermissionDetail);
router.route("/:id").delete(deletePermissionDetail);

module.exports = router;