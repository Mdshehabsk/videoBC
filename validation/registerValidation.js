const Joi = require("joi");
const formidable = require("formidable");
const registerValidation = async (req, res, next) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    const { name, email, password, cpassword } = fields;
    const { avatar } = files;
    // if (!name || !email || !password || !cpassword) {
    //   return res.status(400).json({
    //     message: "please fill all the fields",
    //     path: ["name", "email", "password", "cpassword"],
    //   });
    // }
    const Schema = Joi.object({
      name: Joi.string()
        // .required()
        .min(3)
        .message("username must be bigger than 3")
        .max(15)
        .message("usernaem must be shorter than 15"),
      email: Joi.string()
        // .required()
        // .message("email is required")
        .email({ minDomainSegments: 2 })
        .message("must have two domain parts"),
      password: Joi.string()
        // .required()
        // .message("password is required")
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      cpassword: Joi.string()
        // .required()
        // .message("confirm-password is required")
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });
    const { error, value } = Schema.validate({
      name,
      email,
      password,
      cpassword,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        path: error.details[0].path[0],
      });
    }
    if (!avatar) {
      return res
        .status(400)
        .json({ message: "please upload an avatar", path: "avatar" });
    }
    if (avatar.size > 1 * 1024 * 1024) {
      return res
        .status(400)
        .json({ message: "image size should be smaller than 1MB",path:'avatar' });
    }
    const mimetype =
      avatar.mimetype == "image/jpeg" ||
      avatar.mimetype == "image/png" ||
      avatar.mimetype == "image/jpg";
    console.log(mimetype);
    req.user = fields;
    req.avatar = avatar;
    if(mimetype == false){
      return res.json(400).json({message:'please upload legal image'})
    }
    
    next();
  });
};

module.exports = registerValidation;
