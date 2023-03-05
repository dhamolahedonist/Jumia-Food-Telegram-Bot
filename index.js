const express = require("express");
const app = express();

const PORT = 3000;
app.use(express.static("static"));
app.use(express.json());
require("dotenv").config();
const { Telegraf } = require("telegraf");
const webhookController = require("./controllers/webhookController");

const bot = new Telegraf(process.env.BOT_TOKEN);

app.get("/", (req, res) => {
  res.json({
    status: true,
  });
});

app.post("/webhook", (req, res) => {
  let reply = "I cannot understand your request, Please try again";
  try {
    reply = webhookController.handle(req);
    if (req.body.message.text === 0) {
      return (reply = webhookController.cancel(req));
    }
  } catch (error) {
    console.log(error);
  }

  bot.telegram.sendMessage(req.body.message.chat.id, reply);

  res.json({
    status: true,
    data: reply,
  });
});

app.use(bot.webhookCallback("/webhook"));
bot.telegram.setWebhook(`${process.env.BASE_URL}/webhook`);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
