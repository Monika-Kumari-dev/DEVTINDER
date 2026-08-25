const express = require("express");

const {validateSignUpData} = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup",async(req,res) =>{
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
authRouter.post("/logout",async (req,res) =>{
    res.cookie("token",null,{
        
        expires: new Date(Date.now()),
       
    });
    res.send("Log out Successful");
   
})
module.exports = authRouter;