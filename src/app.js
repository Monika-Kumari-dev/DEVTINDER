const express = require("express");
const app = express();
app.use(express.json());
const connectDB = require("./config/database")
const jwt = require("jsonwebtoken");
const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const RequestRouter = require("./Routes/Request");
const User = require("./models/user");
const userRouter = require("./Routes/user");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// const jwt = require("jsonwebtoken");
app.use("/",authRouter);
app.use("/",RequestRouter);
app.use("/",profileRouter);
app.use("/", userRouter);


app.get("/user",async(req,res) =>{
    const userEmail = req.query.emailId;
    try{
        const users = await User.find({emailId:userEmail});
        if(users.length === 0){
            res.status(404).send("User not found");
    } else{
        res.send(users);
    }}catch (err){
        res.status(400).send("Something went wrong");
    }
});
//Feed API -GET /feed - get all the users from the database 
app.get("/feed",(req,res) =>{});

app.delete("/user",async(req,res) =>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({_id: userId});


        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});
//Update data of the user
app.patch("/user",async(req,res) =>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({_id: userId },data,{
            returnDocument: "after",
        });
        console.log(user);
        res.send("User updated successfully");
    } catch (err){
        res.status(400).send("UPDATE FAILED:" + err.message);
    }
});
app.patch("/user/:userId",async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["about","gender","age","Skills"];
        const isUpdateAllowed = Object.keys(data).every((K)=>
            ALLOWED_UPDATES.includes(K)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");

        }if(data?.Skills?.length > 10){
            throw new Error("Skills cannot be more than 10");
        }const user = await User.findByIdAndUpdate({_id: userId},data,{
            returnDocument: "after",
            runValidators: true,
        });
        res.send(user);
       
    }catch(err){
        res.status(400).send("Update Failed"+err.message);
    }
});
app.post("/login",async(req,res) =>{
    try{
        const {emailId,password } = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid){
        //Create a JWT token 
        const token = await jwt.sign({_id:user._id},"Monikatinder$123");
        console.log(token);
        res.cookie("token",token);
        res.send("Login Successfully!!!");
    }else{
        throw new Error(" Invalid credential");
    }
    }catch (err){
        res.status(400).send("Error: "+err.message);
    }
});


connectDB();
app.listen(1515,() =>{
    console.log("Server is successfully listening on port 1515...");
});