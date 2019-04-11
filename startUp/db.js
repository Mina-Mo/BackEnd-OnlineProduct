// config Mongoose DB 

const mongoose = require("mongoose")
const winston = require("winston")
const logger = require("./errLogging")
require('dotenv').config()
// mongoose.set("debug", true)    used for debuging mongoose requests

// to be able to use schema type "unique : true"
mongoose.set('useCreateIndex', true);

// set the connection to mongoose db
module.exports = function(){
    mongoose.connect(process.env.DB , {useNewUrlParser:true})
    .then(()=>console.log("Connected to MongoDB..."))
}