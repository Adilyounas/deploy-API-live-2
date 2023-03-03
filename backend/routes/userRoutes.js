const express = require("express");
const {
  register,
  login,
  logout,
  forgot,
  reset,
  profile,
  updateProfile,
  updatePassword,
  getAllUsers,
  getSingleUser,
  updateRole,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();
const { authentication, authRoles } = require("../Authentication/auth");

//register a user
router.route("/register").post(register);

//login a user
router.route("/login").post(login);

//logout a user
router.route("/logout").get(logout);

//forgot a user
router.route("/forgot").post(forgot);

//reset a user
router.route("/reset/:token").put(reset);

//profile / my details
router.route("/profile").get(authentication, profile);

//update / update my details
router.route("/updateProfile").put(authentication, updateProfile);

//update password
router.route("/updatePassword").put(authentication, updatePassword);

// <--------------Routes for admin for users----------->
//get all users
router
  .route("/admin/users")
  .get(authentication, authRoles("admin"), getAllUsers);

//get single user
router
  .route("/admin/user/:id")
  .get(authentication, authRoles("admin"), getSingleUser);

//update user role
router
  .route("/admin/updateUser/:id")
  .put(authentication, authRoles("admin"), updateRole);

//delete user
router
  .route("/admin/deleteUser/:id")
  .delete(authentication, authRoles("admin"), deleteUser);

module.exports = router;
