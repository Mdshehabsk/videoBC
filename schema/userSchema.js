const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
    },
    cpassword:{
        type: String,
    },
    avatarImg :{
        type: String
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;