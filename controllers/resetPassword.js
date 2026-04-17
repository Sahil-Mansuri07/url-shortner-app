const userModel = require("../models/user");

const createNewPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    
    if (newPassword !== confirmPassword) {
      return res.render("resetPassword", {
        message: "Passwords do not match",
        token
      });
    }

    
    const user = await userModel.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() }
    });

    
    if (!user) {
      return res.render("resetPassword", {
        message: "Link expired or invalid"
      });
    }

   
    user.password = newPassword;

    
    user.resetToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();

    
    return res.render("login", {
      message: "Password updated successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = { createNewPassword };