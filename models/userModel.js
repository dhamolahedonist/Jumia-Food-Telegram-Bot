const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  telegramId: {
    type: Number,
    required: true,
    unique: true,
  },
  step: {
    type: String,
    default: "welcome",
  },
});

module.exports = mongoose.model("User", UserSchema);
