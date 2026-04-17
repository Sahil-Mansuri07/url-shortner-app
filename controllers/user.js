const userModel=require("../models/user");

const {sendWelcomeMail, sendResetPassword }=require("../config/mailer");

const generateOTP=require("../utils/generateOTP");

const {v4:uuidv4}=require("uuid");

const crypto=require("crypto");

const {setUser}=require("../service/auth");

async function userSignup(req, res) {

    const {name,email,password,role}=req.body;
    
    const genrateOtp=generateOTP();

    await sendWelcomeMail(email, genrateOtp.otp);
    
    await userModel.create({name,email,password,role,otp:genrateOtp.otp,otp_expiry:genrateOtp.expiry});

    return res.render("verifyOtp",{email:email});
}

async function verifyOtp(req, res) {

    const {email,otp}=req.body;

    const user=await userModel.findOne({email,otp});

    if (!user) {
        return res.render("verifyOtp", { error: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
  return res.send("OTP Expired");
}

    user.isVerified=true;
    user.otp=undefined;
    user.otpExpiry=undefined;
    await user.save();

    return res.redirect("/login");
}

async function forgetPassword(req, res) {

    const { email } = req.body;

   
    const user = await userModel.findOne({ email });
    if (!user) return res.send("User not found");

    
    const token = crypto.randomBytes(32).toString("hex");

    
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 15 * 60 * 1000; 
    await user.save();

   
    const link = `${process.env.BASE_URL}/resetPassword/${token}`;

    
    await sendResetPassword(email, link);

    return res.render("notify", { email });
}

async function userLogin(req, res) {

    const {email,password}=req.body;
    
    try {
        const token= await userModel.matchPasswordAndGenerateToken(email,password);
        return res.cookie("cookieToken",token,{
  httpOnly: true,
  secure: true,
  sameSite: "None"
}).redirect("/");
    } catch (error) {
        return res.render("login",{error:"Invalid Credentials"});
    }

}


module.exports={
    userSignup,
    verifyOtp,
    userLogin,
    forgetPassword,
};
