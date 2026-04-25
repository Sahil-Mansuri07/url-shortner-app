const express=require("express");

const urlModel=require("../models/url");

const {createNewPassword}=require("../controllers/resetPassword");

const {checkForAuthentication,restrictTo}=require("../middlewares/auth");

const router=express.Router();

router.get("/admin/urls",restrictTo(["ADMIN"]), async(req, res)=>{

    if (!req.user) {
      return res.redirect("/login");
    }

    const allUrls=await urlModel.find({});
   
    return res.render("home",{urls:allUrls,
    user:req.user,
    });
});

router.get('/', restrictTo(["NORMAL","ADMIN"]), async(req, res)=>{

    if (!req.user) {
      return res.redirect("/login");
    }

    const allUrls=await urlModel.find({createdBy:req.user._id});

    return res.render("home",{urls:allUrls,
    user:req.user,
    });
});



router.get("/signup",async(req, res)=>{

    return res.render("signup");
});


router.get("/login",async(req, res)=>{
     const verified = req.session.verified;
    req.session.verified = false; // ek baar hi dikhe
     return res.render("login", { verified });
    
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