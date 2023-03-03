const User = require("../models/userModel");
const sendToken = require("../middleWare/sendToken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//Register a user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "Sample id",
        url: "Sample id",
      },
    });
    const message = "Register Successfully";
    await sendToken(res, user, 201, message);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter both fields properly",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your data is not available So, Register first",
      });
    }

    const userPasswordMatching = await user.passwordMatching(password);

    if (!userPasswordMatching) {
      return res.status(400).json({
        success: false,
        message: "Your data is not available So, Register first",
      });
    }
    const message = "Login Successfully";
    await sendToken(res, user, 201, message);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//logout a user
const logout = async (req, res) => {
  try {
    const options = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };

    res.status(200).cookie("token", null, options).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//forgot password
const forgot = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Enter Your email for password recovery",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Enter Your valid email for password recovery",
    });
  }

  const resetToken = await user.resetTokenGenerating();
  if (!resetToken) {
    return res.status(400).json({
      message: "Token for forgot is not genertating",
    });
  }

  await user.save({ validateBeforeSave: false });

  try {
    const mail_URL = `Your reset password token is \n\n ${
      req.protocol
    }://${req.get(
      "host"
    )}/api/v1/reset/${resetToken} \n\n If you was not trying to reset then ignore it`;
    let transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMPT_USER,
      to: email,
      subject: "Hello ✔ from Ecommerce Website",
      text: mail_URL,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//reset password
const reset = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter Both fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password should be equal",
      });
    }

    const token = req.params.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid or Expires",
      });
    }

    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = confirmPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//my details
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Update Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//update password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;
    if (!oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter the old password as well",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Fill both fields",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password should be same",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userPasswordMatching = await user.passwordMatching(oldPassword);

    if (!userPasswordMatching) {
      return res.status(400).json({
        success: false,
        message: "Invalid password to match",
      });
    }

    user.password = confirmPassword;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Update Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const TotalUserCounts = await User.countDocuments();

    if (!users || !TotalUserCounts) {
      return res.status(400).json({
        success: false,
        error: "Users are not found",
      });
    }

    res.status(200).json({
      success: true,
      TotalUserCounts,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//get single users
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//update user role
const updateRole = async (req, res) => {
  try {
    const { userRole } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    user.userRole = userRole;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "user is updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//delete user
const deleteUser = async (req,res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    await user.remove()

    res.status(200).json({
      success: true,
      message: "user is deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
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
};
