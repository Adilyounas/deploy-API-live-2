const sendToken = async (res, user, statusCode, message) => {
  const token = await user.generatingJWT();
  const options = {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    expires: new Date(
      Date.now() + 5 * 24 * 3600 * 1000
    ),
  };
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is not Generating",
    });
  }

  res.setHeader("jwtToken", "token")

  res.status(statusCode).json({
    success: true,
    token,
    user,
    message,
  });
};

module.exports = sendToken;
