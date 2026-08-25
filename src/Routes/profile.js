const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
profileRouter.get("/profile",userAuth,async(req,res) =>{try{
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
profileRouter.get("/profile/view",userAuth,async(req,res) =>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR: " +err.message);
    }
});
profileRouter.patch("/profile/edit",userAuth,async (req,res) =>{
try{
    
if(!validateEditProfileData(req));{
    throw new Error("Invalid Edit Request");
}
}catch (err) {
    res.status(400).send("ERROR :" + err.message);
}
});
module.exports = profileRouter;
