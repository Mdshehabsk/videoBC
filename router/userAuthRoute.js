const express = require('express')
const { userRegister, userLogin } = require('../controller/userAuthController')
const registerValidation = require('../validation/registerValidation')


const router = express.Router()

router.post('/login',userLogin)
router.post('/register',registerValidation,userRegister)


module.exports = router