const express=require("express");

const urlModel=require("../models/url");

const {createNewPassword}=require("../controllers/resetPassword");

const {checkForAuthentication,restrictTo}=require("../middlewares/auth");

const router=express.Router();

router.get("/admin/urls",restrictTo(["ADMIN"]), async(req, res)=>{

    const allUrls=await urlModel.find({});
   
    return res.render("home",{urls:allUrls});
});

router.get('/', restrictTo(["NORMAL","ADMIN"]), async(req, res)=>{

    const allUrls=await urlModel.find({createdBy:req.user._id});
   
    return res.render("home",{urls:allUrls});
});



router.get("/signup",async(req, res)=>{

    return res.render("signup");
});


router.get("/login",async(req, res)=>{

    return res.render("login");
});

router.get("/forgetPassword",async(req, res)=>{

    return res.render("forgetPassword");
});

router.get("/resetPassword/:token",async(req, res)=>{

   const { token } = req.params;

    console.log("CookieToken value is: ",token);

   return res.render("resetPassword", { token: token });
});

router.post("/resetPassword/:token",createNewPassword);

module.exports=router;