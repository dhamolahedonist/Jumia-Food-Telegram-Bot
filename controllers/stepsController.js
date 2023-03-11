const User = require("../models/userModel");
const userController = require("./userContoller");
const Order = require("../models/orderModel");
const stepsController = {
  start: async (req) => {
    await userController.updateStep(req, "selectOption");

    return `Hi ${req.body.message.chat.first_name}, welcome back! \n\n1 to place an order  \n98 to see order history  \n0 to cancel order`;
  },
  selectOption: async (req) => {
    const text = req.body.message.text;
    if (text === "1") {
      await userController.updateStep(req, "placeOrder");
      return `Please select items you would like to buy \n1 to buy Jollof Rice\n2 to buy Fried Rice\n3 to buy Ofada Rice\n4 to buy Coconut Rice`;
    }
    if (text === "98") {
      await userController.updateStep(req, "start");
      return `this is your order history`;
    }
    if (text === "0") {
      await userController.updateStep(req, "start");
      return `Thank you!!!`;
    }

    return `I have selected an option`;
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
    console.log(product);

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
  checkOutOrder: async (req) => {
    const text = req.body.message.text;
    if (text === "99") {
      return `Order placed successfully. You will be contacted when our delivery agent is at your location.
      \n1 to place an order\n98 to see order history\n0 to cancel order`;
    }
    if (text === "1") {
      await userController.updateStep(req, "start");
      return await stepsController.start(req);
    }
    if (text === "0") {
      await userController.updateStep(req, "start");

      return `Order has been cancelled`;
    }
  },
};

module.exports = stepsController;
