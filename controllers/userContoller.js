const User = require("../models/userModel");

const userController = {
  getUser: async (req) => {
    const body = req.body;

    try {
      const user = await User.findOne({
        username: body.message.chat.username,
      });

      if (user) {
        return user;
      }
      const newUser = await User.create({
        telegramId: body.message.chat.id,
        username: body.message.chat.username,
      });

      return newUser;
    } catch (error) {
      return null;
    }
  },
  updateStep: async (req, step) => {
    const body = req.body;
    const user = await User.findOne({
      username: body.message.chat.username,
    });
    user.step = step;
    await user.save();
  },
};

module.exports = userController;
