const mongoose=require("mongoose");

const {randomBytes,createHmac}=require("crypto");

const {createTokenForUser}=require("../service/auth");

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
    type:String,
},
password:{
    type:String,
    required:true,
},
    role:{
        type:String,
        default:"NORMAL",
    },
    otp: {
        type: String,
    },

    otpExpiry: {
        type: Date,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },
    resetToken: {
    type: String,
},
tokenExpiry: {
    type: Date,
},

});

userSchema.pre("save",function(){
    const user=this;
    if(!user.isModified("password")) return;

    const salt=randomBytes(16).toString("hex");

    const hashedPassword=createHmac("sha256",salt)
    .update(user.password)
    .digest("hex");

    this.salt=salt;
    this.password=hashedPassword;
});

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){

    const user=await this.findOne({email});

    if(!user) throw new Error("User not found");

    const salt=user.salt;
    const hashedPassword=user.password;

    const userProvidedHash=createHmac("sha256",salt)
    .update(password)
    .digest("hex");

   if(userProvidedHash!==hashedPassword) throw new Error("Invalid password");
   
    const token=createTokenForUser(user);
    
    return token;
});

const userModel=mongoose.model("users",userSchema);

module.exports=userModel;