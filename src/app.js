const express = require("express");

const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
app.use(express.json());

app.get("/user",async(req,res) =>{
    const userEmail = req.body.emailId;
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
    const user = new User (req.body);

try{    await user.save();
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
connectDB();
app.listen(1515,() =>{
    console.log("Server is successfully listening on port 1515...");
});