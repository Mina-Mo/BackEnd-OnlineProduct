//Handling and loging Errors

const winston = require("winston")
require('winston-mongodb');

// create log file on server and on DB 
module.exports = function(){
    const logger = winston.createLogger({
        transports:[
            new winston.transports.File({filename: "logfile.log"}),
            new winston.transports.MongoDB({
                db:"mongodb://localhost:27017/Products",
                level: "info"
            })
        ]
        , 

        // handling unhandling exceptions
        exceptionHandlers: [
            new winston.transports.File({ filename: 'exceptions.log' })
          ]
    })
    
    // handling unhandled rejections by throwing exception to be passed to winston exceptionHandlers
    process.on("unhandledRejection",(ex)=>{
        throw ex
        })
        
 }