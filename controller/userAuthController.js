const bcrypt = require("bcrypt");
const createError = require("http-errors");
const cloudinary = require('cloudinary')
const jwt = require('jsonwebtoken')
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});
const User = require("../schema/userSchema");

const userRegister = async (req, res, next) => {
  try {
      const {name,email,password,cpassword} = req.user
      const avatar = req.avatar
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({
          message: "user already exist",
          path: "email",
        });
      }
      if (password !== cpassword) {
        return res.status(400).json({
          message: "password does not match",
          path: "password",
        });
      }
      const hastPassword = await bcrypt.hash(password, 10);
      const hastCpassword = await bcrypt.hash(cpassword, 10);
      const result = await cloudinary.uploader.upload(avatar.filepath, {upload_preset: avatar.originalFilename});
      const user = new User({
        name,
        email,
        password: hastPassword,
        cpassword: hastCpassword,
        avatarImg:result.url
      });
      await user.save();

      return res.status(201).json({
        message: "user created successfully",
      });
  } catch (err) {
    next(createError(500, err));
  }
};
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "please input email",
        path: "email",
      });
    }
    if(!password) {
      return res.status(400).json({
        message: "please input password",
        path: "password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "user does not exist",
        path: "email",
      });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "password does not match",
        path: "password",
      });
    }
    const token = jwt.sign({id:user._id,email:user.email,avatarImg:user.avatarImg},process.env.JWT_SECRET,{expiresIn:'36h'})
    return res.status(200).json({
      message: "login successfully",
      token
    });
  } catch (err) {
    return next(createError(500, err));
  }
};

module.exports = {
  userLogin,
  userRegister,
};
