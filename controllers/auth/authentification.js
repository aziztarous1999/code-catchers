const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{

/*

    if(req.method === 'OPTIONS')
    {
        next();
    }

    */

    try{
    const token = req.headers.authorization.split(' ')[1]; // authorization:'Bearer TOKEN'
    if(!token){
        throw new Error('Authentication failed');
    }

    const decodedToken = jwt.verify(token,process.env.SECRET_CODE);
    req.userData={
        userId:decodedToken.userId,
        email:decodedToken.email,
        role:decodedToken.role
      };
    next();
    

}catch(err){
    res.status(403).json("Authentication failed");
}


};