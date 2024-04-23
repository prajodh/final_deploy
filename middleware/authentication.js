const User = require("../models/login")
const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')


const auth = async (req,res,next) =>{
    const authHeader = req.headers.authorization
    // console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(StatusCodes.UNAUTHORIZED).json({msg:"Invalid User",data:{},status_code:StatusCodes.UNAUTHORIZED})
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {userID:payload.userID, username:payload.username}
        next()
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({msg:"Invalid User",data:{},status_code:StatusCodes.UNAUTHORIZED})
    }
}

module.exports = auth