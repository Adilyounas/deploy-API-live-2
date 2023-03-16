const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authentication = async (req, res, next) => {
  try {
    const { token } =await req.cookies;
    console.log(token);
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "1Login first",
      });
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedData.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "2Login first",
      });
    }

    req.user = await user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//Authentication accourding to roles
const authRoles =  (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      return res.status(400).json({
        success: false,
        message:"Your role is not for this resource",
      });
    }

    next()
  };
};

module.exports = { authentication, authRoles };
