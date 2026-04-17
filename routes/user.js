const express=require("express");

const {userSignup,verifyOtp,userLogin,userHome,forgetPassword,}=require("../controllers/user");

const {createNewPassword}=require("../controllers/resetPassword");

const router=express.Router();

router.post("/", userSignup);

router.post("/verify", verifyOtp);

router.post("/login", userLogin);

router.post("/forgetPassword",forgetPassword);

router.post("/resetPassword",createNewPassword);

router.get("/logout",(req,res)=>{
    res.clearCookie("cookieToken").redirect("/login");
});

module.exports=router;