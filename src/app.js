const express = require("express");
const app = express();
app.use(express.json());
const connectDB = require("./config/database")


const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {validateSignUpData} = require("./utils/validation");

app.use(cookieParser());

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
app.post("/signup",async(req,res) =>{
//validation of data
try{ 
    console.log(req.body);
validateSignUpData(req);
const {firstName,lastName,emailId,password,gender} = req.body;
//Encrypt the password and then store into database

//Encrypt the password
const passwordHash =  await bcrypt.hash(password,10);
console.log(passwordHash);
//Creating a new instance of the User model
 const user = new User ({
    firstName,
    lastName,
    emailId,
    password:passwordHash,
    gender,
 });


   await user.save();
res.send("user created successfully");
} catch (err){
    res.status(400).send("Error saving user:"+err.message);
}
});
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
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
app.get("/profile",async(req,res) =>{try{
    const cookies = req.cookies;
    const {token} = cookies;
    if(!token){
        throw new Error("Invalid Token");
    }
    //validate my token
    const decodedMessage = await jwt.verify(token,"Monikatinder$123")

    // console.log(decodedMessage);
    const{ _id } = decodedMessage;
    console.log("Logged In user is:" + _id);
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User does not exist");
    }
   res.send(user);
}catch(err){
    res.status(400).send("Error : " + err.message);
}
});
connectDB();
app.listen(1515,() =>{
    console.log("Server is successfully listening on port 1515...");
});