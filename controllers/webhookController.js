const webhookController = {
  handle: (req) => {
    return `Hi ${req.body.message.chat.first_name}, welcome back! \n\n1 to place an order \n99 to checkout order \n98 to see order history \n97 to see current order \n0 to cancel order`;
  },
};

module.exports = webhookController;
