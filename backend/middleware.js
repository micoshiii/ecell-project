const jwt = require("jsonwebtoken");

function authMiddleware(req , res , next){
    try{
        const token = req.headers.token;

        if(!token){
            return res.status(403).json({
                message: "token missing"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.userId;
        next();

    } catch(err){
        res.status(403).json({
            message: "invalid token"
        });
    }
}

module.exports = {
    authMiddleware : authMiddleware
}