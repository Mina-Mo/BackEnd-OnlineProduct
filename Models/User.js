const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken")
require('dotenv').config()

// create user model
const Users = mongoose.model("User", new mongoose.Schema({
    Name:{
        type: String,
        minlength:4,
        maxlength:30,
        required: true
    },
    Email:{
        type: String,
        minlength: 6,
        maxlength:30,
        unique: true,
        lowercase:true,
        trim: true,
        required: true
    },
    Password:{
        type:String,
        minlength:8,
        maxlength:1024,
        trim: true,
        required: true
    },
    CreatedItems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Item",
    }],
    isAdmin:{
        type: Boolean
    }
}))


// generate access token using JWT
function generateToken(user){
   return jwt.sign({_id: user._id, Name: user.Name, Email: user.Email}, process.env.TOKEN_KEY)
}

// validate input using joi for creating new user
function inputValidation(user){
   const schemaInput={
        Name:Joi.string().min(4).max(30),
        Email:Joi.string().email().min(6).max(30).required(),
        Password:Joi.string().min(8).required(),
        CreatedItems:Joi.string()
    }
    return Joi.validate(user, schemaInput)
}



exports.Users = Users;
exports.inputValidation = inputValidation;
exports.generateToken = generateToken;
