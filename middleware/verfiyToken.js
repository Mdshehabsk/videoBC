const jwt = require('jsonwebtoken')

async function TokenVerfiy (req,res,next) {
    try {
        const authorization = req.headers && req.headers['authorization'].split(' ')
    const token = authorization[1]
    if(token === undefined){
        return res.status(411).json({message:'token is missing'})
    }
    const verfiy = jwt.verify(token,process.env.JWT_SECRET)
    if(!verfiy){
        return res.status(401).json({message:'token invalid'})
    }
    req.user = verfiy
    next()
    }
    catch(err){
        next(err)
    }
}

module.exports = TokenVerfiy;