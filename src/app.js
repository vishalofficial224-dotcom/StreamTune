const { TelegramBot } = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { search, init } = require("./search.js");
const { Callback } = require("puppeteer");
const Buttons = require("./keyboard.js");
const downloadAudio = require("./download.js");
const fs = require("fs");
const buttons = require("./keyboard.js");
dotenv.config();
// For CommonJS use:
// const { TelegramBot } = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.YOUR_TELEGRAM_BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
const tempSongData = new Map();

init().then(() => {
  console.log("Search enginer is ready!");
});

// Listen for any kind of message. There are different kinds of messages.
bot.on("message", async (msg) => {
  const songs = await search(msg.text);
  tempSongData.set(msg.chat.id, songs);
  const chatId = msg.chat.id;
  const buttons = Buttons(songs);

  if (msg.text === "/start") {
    bot.sendMessage(chatId, "hey, Type a song name - i'll find and send it.");
  } else {
    songName = bot.sendMessage(chatId, "Choose a song:", {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }
});

bot.on("callback_query", async (query) => {
  try {
    const songs = tempSongData.get(query.message.chat.id);
    const filePath = await downloadAudio(query.data);
    const song = songs.find((s) => s.videoId === query.data);
    await bot.sendAudio(query.message.chat.id, fs.createReadStream(filePath), {
      title: song.name,
    });
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log(error);
    await bot.sendMessage(
      query.message.chat.id,
      "X Download failed. \n\nPlease try another result from the list or search for a different song.",
    );
  }
});
