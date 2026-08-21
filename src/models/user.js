const mongoose = require('mongoose');
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName: {
        type:String
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        Unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address:" + value);
            }
        }
    },
    userId:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        required: [true,'Gender is required'],
        trim:true,
        validate(value){
            if (!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },

    },
    about:{
        type:String,
        default:"This is a default about of the user!",
    },
    Skills:{
        type:[String],
    },},
    {
    
        timestamps:true,
    },

);
module.exports = mongoose.model("User",userSchema);