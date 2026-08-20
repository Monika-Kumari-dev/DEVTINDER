const express = require("express");

const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");

app.post("/signup",async(req,res) =>{
    const user = new User ({
      firstName:"Monika",
      lastName:"Singh",
      emailId:"monikapratima7870@gmail.com",
      password:"monika123@",
    
});
await user.save();
res.send("user created successfully");
});
connectDB();
app.listen(1515,() =>{
    console.log("Server is successfully listening on port 1515...");
});