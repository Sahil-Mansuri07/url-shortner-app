const { validateToken }=require("../service/auth");

async function checkForAuthentication(req, res, next){

    const token=req.cookies.cookieToken;

    req.user=null;

    if(!token) return next();

    const user=await validateToken(token);

    req.user=user;

    return next();

}

function restrictTo(roles=[]){

    return function(req,res,next){

        if(!req.user) return res.redirect("/signup");
        
        if(!roles.includes(req.user.role)) return res.end("UnAuthorized");

        return next();
    }
}

module.exports={checkForAuthentication,restrictTo};