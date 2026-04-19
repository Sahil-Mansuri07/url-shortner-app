const express=require("express");

const urlModel=require("../models/url");

const {generateShortUrl,getAnalytics,redirectUrl,deleteUrl}=require("../controllers/url");

const {checkForAuthentication}=require("../middlewares/auth");

const router=express.Router();

router.post("/",generateShortUrl);
router.get("/analytics/:id",getAnalytics);
router.post("/delete/:id", checkForAuthentication, deleteUrl);
router.get("/:shortId",redirectUrl);

module.exports=router;
