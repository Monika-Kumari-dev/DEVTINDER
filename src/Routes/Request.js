const express = require("express");
const RequestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/user");


RequestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      const allowedStatus = ["ignored", "interested"];

      // Validate status
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }


      // Check if receiver exists
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({
          message: "User not found!",
        });
      }


      // Prevent sending request to yourself
      if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).json({
          message: "You cannot send a connection request to yourself!",
        });
      }


      // Check existing request in either direction
      const existingConnectionRequest =
        await ConnectionRequest.findOne({
          $or: [
            {
              fromUserId,
              toUserId,
            },
            {
              fromUserId: toUserId,
              toUserId: fromUserId,
            },
          ],
        });


      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request Already Exists!",
        });
      }


      // Create connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });


      const data = await connectionRequest.save();


      return res.status(201).json({
        message:
          req.user.firstName +
          " is " +
          status +
          " in " +
          toUser.firstName,
        data,
      });

    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }
);


module.exports = RequestRouter;