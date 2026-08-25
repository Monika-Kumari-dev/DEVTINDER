const express = require("express");
const RequestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

RequestRouter.post("/sendConnectionRequest",userAuth,async(req,res) =>{
   const user = req.user;
    console.log("Sending the connection request ");
    res.send(user.firstName+"Connection Request Send");
});
module.exports = RequestRouter;