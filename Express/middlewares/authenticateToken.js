const jwt=require('jsonwebtoken')
require('dotenv').config();

const authenticateToken=(req,res,next)=>{
    try{

        const token=req.headers.authorization.split(' ')[1];

        if(!token)
        {
            return res.status(401).json({message:'Authorization header missing'});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded;
        next();
    }catch(error){
        return res.status(403).json({message:'Invalid or expired token'});
    }
};

module.exports=authenticateToken;