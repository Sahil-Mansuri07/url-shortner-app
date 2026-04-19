const express=require("express");

const {userSignup,verifyOtp,userLogin,userHome,forgetPassword,deleteUser}=require("../controllers/user");

const {createNewPassword}=require("../controllers/resetPassword");

const {checkForAuthentication} = require("../middlewares/auth");

const router=express.Router();

router.post("/", userSignup);

router.post("/verify", verifyOtp);

router.post("/login", userLogin);

router.post("/forgetPassword",forgetPassword);

router.post("/resetPassword",createNewPassword);

router.get("/logout",(req,res)=>{
    res.clearCookie("cookieToken").redirect("/login");
});

router.post("/delete",checkForAuthentication,deleteUser);

module.exports=router;