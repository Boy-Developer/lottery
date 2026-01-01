const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { getAllPostSubCategoryDetail, getPostSubCategoryByCategoryId, createPostSubCategory, deletePostSubCategoryDetail, updatePostSubCategoryDetail } = require("./postDetailsController");

router.use(validateToken);
router.route("/").get(getAllPostSubCategoryDetail);
router.route("/:id").get(getPostSubCategoryByCategoryId);
router.route("/").post(createPostSubCategory);
router.route("/:id").delete(deletePostSubCategoryDetail);
router.route("/:id").put(updatePostSubCategoryDetail);

module.exports = router;