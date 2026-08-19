const express = require("express");
require("./config/database")
const app = express();
app.listen(1515,() =>{
    console.log("Server is successfully listening on port 1515...");
});