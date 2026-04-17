const shortId= require('shortid');

const urlModel = require('../models/url');

async function generateShortUrl(req, res){

    const newShortId=shortId.generate();


    const body=req.body;
    
    if(!body.url) return res.status(400).json({error:"url is required"});


    const result=await urlModel.create({
        shortId:newShortId,
        redirectUrl:body.url,
        visitHistory:[],
        createdBy:req.user._id,
    });


    return res.render("home",{id:newShortId});

}

async function redirectUrl(req, res) {

    const shortedId=req.params.shortId;

    const entry= await urlModel.findOneAndUpdate(
        {shortId:shortedId},
        {$push:{visitHistory:{timestamp:Date.now()}}},
    );

   return res.redirect(entry.redirectUrl); 

}


async function getAnalytics(req, res){

    const shortId=req.params.id;

    const result=await urlModel.findOne({shortId:shortId});

    return res.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    });


}

module.exports={generateShortUrl,getAnalytics,redirectUrl};