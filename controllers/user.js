const userModel=require("../models/user");

const {sendWelcomeMail, sendResetPassword }=require("../config/mailer");

const generateOTP=require("../utils/generateOTP");

const {v4:uuidv4}=require("uuid");

const crypto=require("crypto");

const {setUser}=require("../service/auth");

async function userSignup(req, res) {
    try {
        const {name,email,password,role} = req.body;

        if (!email.includes("@")) {
  return res.status(400).render("signup", {
    error: "Invalid email format"
  });
}

        const existingUser = await userModel.findOne({email});

        if (existingUser) {
            return res.status(400).render("signup", { error: "Email already exists" });
        }

        const genrateOtp = generateOTP();

        await userModel.create({
            name,
            email,
            password,
            role,
            otp: genrateOtp.otp,
            otp_expiry: genrateOtp.expiry
        });

        await sendWelcomeMail(email, genrateOtp.otp);

        return res.status(200).render("verifyOtp",{email:email});

    } catch (err) {
        console.log("Signup Error:", err);
        return res.status(500).render("signup", { error: "Something went wrong" });
    }
}
async function verifyOtp(req, res) {

    try {
    const {email,otp}=req.body;

    const user=await userModel.findOne({email,otp});

    if (!user) {
        return res.status(400).render("verifyOtp", { error: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
  return res.status(400).send("OTP Expired");
}

    user.isVerified=true;
    user.otp=undefined;
    user.otpExpiry=undefined;
    await user.save();

   req.session.verified = true;
res.redirect("/login");
}
catch (err) {
    console.log("OTP Verification Error:", err);
    return res.status(500).render("verifyOtp", { error: "Something went wrong" });
}
}
async function forgetPassword(req, res) {

    try {
    const { email } = req.body;

   
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).render("forgetPassword", { error: "User not found" });

    
    const token = crypto.randomBytes(32).toString("hex");

    
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 15 * 60 * 1000; 
    await user.save();

   
    const link = `${process.env.BASE_URL}/resetPassword/${token}`;

    
    await sendResetPassword(email, link);

    return res.status(200).render("notify", { email });
}
catch (err) {
    console.log("Forget Password Error:", err);
    return res.status(500).render("forgetPassword", { error: "Something went wrong" });
}
}

async function userLogin(req, res) {

    const {email,password}=req.body;
    
    try {
        const token= await userModel.matchPasswordAndGenerateToken(email,password);
        return res.status(200).cookie("cookieToken",token,{
  httpOnly: true,
  secure: true,
  sameSite: "None",
}).redirect("/");
    } catch (error) {
        return res.status(400).render("login",{error:"Invalid Credentials"});
    }

}


module.exports={
    userSignup,
    verifyOtp,
    userLogin,
    forgetPassword,
};
