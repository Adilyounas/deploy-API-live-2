const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  userRole: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpires: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  return (this.password = await bcrypt.hash(this.password, 10));
});

//password matching
userSchema.methods.passwordMatching = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//genterating token
userSchema.methods.generatingJWT = async function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//cryto reset token generating
userSchema.methods.resetTokenGenerating = async function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    this.resetPasswordExpires = Date.now() + process.env.RESET_PASSWORD *60*1000
    return token
};

module.exports = new mongoose.model("User", userSchema);
