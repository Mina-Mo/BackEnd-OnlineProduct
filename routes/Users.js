const express = require("express");
const _ = require("lodash")
const bcrypt = require("bcrypt")
const Auth = require("../middleWare/auth")
const ascyncMiddleWare = require("../middleWare/AsyncMiddleWare")
const { Users, inputValidation, generateToken }= require("../Models/User.js")

// create router
const router = express.Router();

// route for getting the profile details passing by auth middleware
router.get("/me", Auth, ascyncMiddleWare(async(req,res)=>{
        const user = await Users.findOne({_id: req.user._id}).populate("CreatedItems").select("Name Email CreatedItems")
        res.send(user)
}))

// route for creating new user
router.post("/signUp", ascyncMiddleWare(async(req, res)=>{
    const user = new Users({
        Name: req.body.Name,
        Email: req.body.Email,
        Password: req.body.Password
    })

    // validate input
    const validation = inputValidation(req.body) 
    if(validation.error)return res.status(400).send(validation.error.details[0].message)
    
    // check if the email has been registered before
    const email =  await Users.findOne({Email: req.body.Email})
    if(email)return res.status(400).send("The user has already registered")

    // create salt for incrypt the password using bcrypt
    const salt = await bcrypt.genSalt(10) 

    // hash the password
    user.Password = await bcrypt.hash(user.Password, salt)

    // save the incrypted password to mongo db
    await user.save();

    // create access token
    const token = generateToken(user)

    // set the header access token
    res.header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")

    .send(_.pick(user, ["Name", "Email"]))
}))
    

// route for logging in the user 
router.post("/logIn", ascyncMiddleWare(async(req, res)=>{
    let user = {
        Email: req.body.Email,
        Password:req.body.Password
    }

    // validate input
    const validation = inputValidation(req.body)
    if(validation.error)return res.status(400).send(validation.error.details[0].message)

    // find the user by the given Email 
    user = await Users.findOne({Email: req.body.Email})

    // checking if the is no email return error
    if(!user)return res.status(400).send("Invalid Email or Password!!!")

    // checking password if it's right or wrong using bycrypt
    const Password = await bcrypt.compare(req.body.Password, user.Password)

    // if wrong password retuen error
    if(!Password)return res.status(400).send("Invalid Email or Password!!!")

    // generate access token
    const token = generateToken(user)

    // set the header access token
    res.header("x-auth-token", token).send(token)
}))


module.exports = router;