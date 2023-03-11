const stepsController = require("./stepsController");
const userController = require("./userContoller");

const webhookController = {
  handle: async (req) => {
    const user = await userController.getUser(req);

    // if (user.step === "start") {
    //   return await stepsController.start(req);
    // }
    // if (user.step === "selectOption") {
    //   return await stepsController.selectOption(req);
    // }
    return await stepsController[user.step](req, user);
  },
};

module.exports = webhookController;
