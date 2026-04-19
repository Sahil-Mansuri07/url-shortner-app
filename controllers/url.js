const shortId= require('shortid');

const urlModel = require('../models/url');

async function generateShortUrl(req, res) {
  try {

    if (!req.user) {
      return res.redirect("/login");
    }

    
    const { url } = req.body;

    
    if (!url) {
      return res.status(400).render("home", {
        error: "URL is required",
        user: req.user
      });
    }

   
    function isValidUrl(url) {
      return /^(https?:\/\/)/.test(url);
    }

    let finalUrl = url;

    
    if (!isValidUrl(finalUrl)) {
      finalUrl = "http://" + finalUrl;
    }

    
    if (!isValidUrl(finalUrl)) {
      return res.status(400).render("home", {
        error: "Enter a valid URL",
        user: req.user
      });
    }

    const newShortId = shortId.generate();

    const result = await urlModel.create({
      shortId: newShortId,
      redirectUrl: finalUrl,
      visitHistory: [],
      createdBy: req.user._id,
    });

    
    return res.status(200).render("home", {
      id: newShortId,
      user: req.user
    });

  } catch (err) {
    console.error("Error in generateShortUrl:", err);

    return res.status(500).render("home", {
      error: "Something went wrong",
      user: req.user
    });
  }
}

async function redirectUrl(req, res) {
try{
    const shortedId=req.params.shortId;

    const entry= await urlModel.findOneAndUpdate(
        {shortId:shortedId},
        {$push:{visitHistory:{timestamp:Date.now()}}},
    );

   return res.status(302).redirect(entry.redirectUrl); 
}
catch(err){
    console.log(err);
    return res.status(500).render("home",{error:"Something went wrong"});
}


async function getAnalytics(req, res){
try{
    const shortId=req.params.id;

    const result=await urlModel.findOne({shortId:shortId});

    return res.status.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    });
}
catch(err){
    console.log(err);
    return res.status(500).render("home",{error:"Something went wrong"});

}

module.exports={generateShortUrl,getAnalytics,redirectUrl};