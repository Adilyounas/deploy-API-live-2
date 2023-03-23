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
  .post(  createProduct);

//get all products
router.route("/products").get(getAllProducts);

//get single product
router.route("/product/:id").get(getSingleProduct);

//update product
router
  .route("/admin/updateProduct/:id")
  .put( updateProduct);

//delete product
router
  .route("/admin/deleteProduct/:id")
  .delete(deleteProduct);

module.exports = router;
