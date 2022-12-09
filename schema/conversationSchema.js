const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema({
  senderId: String,
  receiverId: String,
  text: String,
  imageUrl: String,
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
