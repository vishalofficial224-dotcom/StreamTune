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
  // console.log(tempSongData);
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
    console.log(song)
    const waitingMessage = await bot.sendMessage(
      query.message.chat.id,
      "⏳ Please wait a moment. Some songs take a little longer to download.",
    );

    setTimeout(async () => {
      try {
        await bot.deleteMessage(
          query.message.chat.id,
          waitingMessage.message_id,
        );
      } catch (err) {
        console.error("Couldn't delete message:", err);
      }
    }, 3000);
    await bot.sendAudio(query.message.chat.id, fs.createReadStream(filePath), {
      title: song.name,
    });
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log(error);
    await bot.sendMessage(
      query.message.chat.id,
      "❌ Download failed.\n\nYouTube is currently limiting download requests.\n\nPlease try again in a few moments, choose another song from the list, or search for a different song.",
    );
  }
});
