const express=require("express");

const session = require("express-session");

require("dotenv").config();

const path=require("path");

const MongoStore = require("connect-mongo").default;

const cookieParser=require("cookie-parser");

const {checkForAuthentication,restrictTo}=require("./middlewares/auth");

const dbConnect=require("./dbConnection");

const urlRoute=require("./routes/url");

const userRoute=require("./routes/user");

const staticRoute=require("./routes/staticRoute");

const app=express();

const PORT=process.env.PORT || 9000;

dbConnect.connectToMongoDb(process.env.MONGO_URL).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthentication);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:process.env.MONGO_URL,
    }),
     cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

app.use("/url",urlRoute);
app.use("/user",userRoute);
app.use("/",staticRoute);



app.listen(PORT,()=>console.log(`Server started at PORT: ${PORT}`));