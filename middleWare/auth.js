
//middleware to check the user authantication

const jwt = require("jsonwebtoken");

async function auth (req, res, next){
    const token = req.header("x-auth-token")
    if(!token)return res.status(401).send("Access denied, No token provided");
try{
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decodedToken
    next()
}catch(err){
    res.status(400).send("Invalid token")
}
}

module.exports = auth