const User = require("../models/userModel");
const userController = require("./userContoller");
const Order = require("../models/orderModel");
const stepsController = {
  start: async (req) => {
    const text = req.body.message.text;

    if (text === "1") {
      await userController.updateStep(req, "selectOption");
      return `Hi ${req.body.message.chat.first_name}, welcome back! \n\n1 To place an order \n99 To checkout order \n98 To see order history \n97 To see current order  \n0 To cancel order`;
    }

    return `Please press 1`;
  },
  selectOption: async (req) => {
    const text = req.body.message.text;
    if (text === "1") {
      await userController.updateStep(req, "placeOrder");
      return `Please select items you would like to buy \n1 to buy Jollof Rice\n2 to buy Fried Rice\n3 to buy Ofada Rice\n4 to buy Coconut Rice`;
    }
    if (text === "97") {
      await userController.updateStep(req, "start");
      return `No order has been placed yet, please press 1 to return to the main menu`;
    }
    if (text === "99") {
      await userController.updateStep(req, "start");
      return `No order to checkout, please press 1 to return to the main menu`;
    }
    if (text === "0") {
      await userController.updateStep(req, "start");
      return `No order to cancel, please press 1 to return to the main menu`;
    }

    await userController.updateStep(req, "start");
    return `invalid option, press 1 to go back to the main menu`;
  },
  placeOrder: async (req, user) => {
    const text = req.body.message.text;

    await userController.updateStep(req, "verifyOrder");
    const items = {
      1: "Jollof",
      2: "Fried",
      3: "Ofada",
      4: "Coconut",
    };
    const product = items[text];

    // Create an order for the custormer here
    await Order.create({
      userId: user._id,
      productName: product,
      quantity: 0,
    });

    return `how many plates of ${product} Rice would you want to buy?`;
  },
  verifyOrder: async (req, user) => {
    const text = req.body.message.text;
    await userController.updateStep(req, "checkOutOrder");

    let order = await Order.find({ userId: user._id })
      .limit(1)
      .sort({ $natural: -1 });

    order = order[0];

    quantity = parseInt(text);
    order.quantity = quantity;

    await order.save();

    const price = quantity * 2500;
    const deliveryFee = 2500;
    const total = price + deliveryFee;

    // // Bulk
    return `${order.quantity} plate of ${order.productName} Rice = ${price}\nDelivery Fee = ${deliveryFee}\nTotal: ${total} \nEnter
      \n99 to accept and confirm order or \n0 to cancel this request `;
  },
  checkOutOrder: async (req, user) => {
    const text = req.body.message.text;
    if (text === "99") {
      return `Order placed successfully. You will be contacted when our delivery agent is at your location.
      \n1 to place an order\n98 to see order history\n97 to see current order\n0 to cancel order`;
    }
    if (text === "1") {
      await userController.updateStep(req, "start");
      return await stepsController.start(req);
    }
    if (text === "0") {
      await userController.updateStep(req, "start");

      return `Order has been cancelled, please press 1 to return to the main menu`;
    }
    if (text === "97") {
      await userController.updateStep(req, "start");
      let order = await Order.find({ userId: user._id })
        .limit(1)
        .sort({ $natural: -1 });

      order = order[0];

      const price = order.quantity * 2500;
      const deliveryFee = 2500;
      const total = price + deliveryFee;

      return `Your Order history: \n${order.productName} Rice X ${order.quantity} = ${price} \nDelivery Fee = ${deliveryFee} \nTotal =${total} \npress 1 to return to the main menu`;
    }
    if (text === "98") {
      await userController.updateStep(req, "start");
      let order = await Order.find({ userId: user._id });

      order = order[0];

      const price = order.quantity * 2500;
      const deliveryFee = 2500;
      const total = price + deliveryFee;

      return `Your Order history: \n${order.productName} Rice X ${order.quantity} = ${price} \nDelivery Fee = ${deliveryFee} \nTotal =${total} \npress 1 to return to the main menu`;
    }
    return `invalid option, please press 1 to return to the main menu`;
  },
};

module.exports = stepsController;
