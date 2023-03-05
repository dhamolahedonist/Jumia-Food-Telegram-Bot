const food = require("../food");
const webhookController = {
  handle: (req) => {
    return `Hi ${req.body.message.chat.first_name}, welcome back! \n\n1 to place an order \n99 to checkout order \n98 to see order history \n97 to see current order \n0 to cancel order`;
  },
  cancelOrder: () => {
    return `Your order has been canceled`;
  },

  placeOrder: () => {
    return `Please place your order, \n\n1 to buy Jollof Rice \n2 to buy Ofada Rice \n3 to buy Coconut Rice \n4 to buy Fried Rice`;
  },
  processOrder: () => {
    return `How many plates of Jollof Rice would you like to buy?`;
  },

  // processOrder: () => {
  //    food.map((item) => {
  //      console.log(` ${item.id} to buy ${item.name}`);
  //    });
  // },
};

module.exports = webhookController;
