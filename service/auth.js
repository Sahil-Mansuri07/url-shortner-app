const jwt=require("jsonwebtoken");

const secretKey=process.env.JWT_SECRET;

async function createTokenForUser(user) {

    return jwt.sign({
        _id:user._id,
        email:user.email,
        role:user.role,
    },secretKey);
    
}

async function validateToken(token) {

    if(!token) return null;

    try {
        return jwt.verify(token,secretKey);
    } catch (error) {
        return null;
    }
    
}

module.exports={
    createTokenForUser,
    validateToken,
};
