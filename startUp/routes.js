// all middlewares 

const express =require("express")
const Items = require("../routes/Items")
const Users = require("../routes/Users")
const error = require("../middleWare/error")
const cors = require("cors")

module.exports = function(app){

    // used on dev machine to be able to use the localhost
    app.use(cors());
    app.options('*', cors());

    app.use(express.json())
    app.use("/api/items", Items)
    app.use("/api/users", Users)
    app.use(error)

}