const express = require("express");
const app = express();

const axios = require("axios");
const path = require("path");
const PORT = 3000;
app.use(express.static("static"));
app.use(express.json());
require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

app.get("/", (req, res) => {
  res.json({
    status: true,
  });
});

bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Hello there! welcome to Jumia foods, Please note tht we are currently under maintenance"
  );
});

bot.launch();
// app.use(bot.webhookCallback('/webhook'))
// bot.telegram.setWebhook(`${process.env.BASE_URL}/webhook`)

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
