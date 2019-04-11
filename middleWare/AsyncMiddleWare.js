
//Middleware to remove try catch block from each route

module.exports = function(handler){
return async(req, res, next)=>{
    try{
        handler(req, res)
    }catch(ex){
        next(ex)
    }
}
}