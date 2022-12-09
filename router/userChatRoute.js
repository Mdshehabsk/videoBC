const User = require("../schema/userSchema");
const express = require("express");
const TokenVerfiy = require("../middleware/verfiyToken");
const Conversation = require("../schema/conversationSchema");

const router = express.Router();

router.get("/chat-item", TokenVerfiy, async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});
router.get("/conversation/:userId", TokenVerfiy, async (req, res, next) => {
  try {
    const { userId } = req.params;
    // const message = await Conversation.find({
    //   $and: [{ receiverId: { $eq: userId }, senderId: { $eq: req.user.id } }],
    // });
    const message = await Conversation.find({  $or:[
                {senderId:req.user.id,receiverId:userId},
                {senderId:userId,receiverId:req.user.id}
            ]});
    res.status(200).json(message.reverse())
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/new-message/:recieverId", TokenVerfiy, async (req, res, next) => {
  try {
    const { recieverId } = req.params;
    if (req.body.message === "") {
      return;
    }
    await Conversation({
      senderId: req.user.id,
      receiverId: recieverId,
      text: req.body.message,
    }).save();
    res.status(201).json({ message: "message sent successfull" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
