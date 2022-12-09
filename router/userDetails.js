const User = require('../schema/userSchema')
const express = require('express')
const TokenVerfiy = require('../middleware/verfiyToken')
const Conversation = require('../schema/conversationSchema')

const router = express.Router()

router.get('/profile/:id',TokenVerfiy,async (req,res,next)=> {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    }
    catch(err){
        next(err)
    }
})


module.exports = router