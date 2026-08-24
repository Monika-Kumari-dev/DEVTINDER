const jwt = require("jsonwebtoken");
const User = require("../models/user");
const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked");

  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  if (isAdminAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized request");
  }
};
const userAuth = async (req, res, next) => {
  //Read the token from the req cookies

  try {
    const { token } = req.cookies;
    if(!token){
        throw new Error("Token is not valid!!!!!!!");
    }
    // Validate the token
    const decodeObj = await jwt.verify(token, "Monikatinder$123");
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
