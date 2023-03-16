const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const router = express.Router();
const { authentication, authRoles } = require("../Authentication/auth");

//create a product
router
  .route("/admin/createProduct")
  .post(authentication, authRoles("admin"), createProduct);

//get all products
router.route("/products").get(authentication,getAllProducts);

//get single product
router.route("/product/:id").get(getSingleProduct);

//update product
router
  .route("/admin/updateProduct/:id")
  .put(authentication, authRoles("admin"), updateProduct);

//delete product
router
  .route("/admin/deleteProduct/:id")
  .delete(authentication, authRoles("admin"), deleteProduct);

module.exports = router;
