const express = require("express");
const app = express();

const PORT = 3000;
app.use(express.static("static"));
app.use(express.json());
require("dotenv").config();
const { Telegraf } = require("telegraf");
const webhookController = require("./controllers/webhookController");
require("./db").connectToMongoDB(); // Connect to MongoDB

const bot = new Telegraf(process.env.BOT_TOKEN);

app.get("/", (req, res) => {
  res.json({
    status: true,
  });
});

app.post("/webhook", async (req, res) => {
  let reply = "Please press 1";
  try {
    reply = await webhookController.handle(req);
  } catch (error) {
    console.log(error);
  }

  bot.telegram.sendMessage(req.body.message.chat.id, reply);
  res.send(reply);
});

app.use(bot.webhookCallback("/webhook"));
bot.telegram.setWebhook(`${process.env.BASE_URL}/webhook`);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
