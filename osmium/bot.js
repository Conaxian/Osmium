require("dotenv").config();

const Discord = require("discord.js");
const options = {
  ws: {
    intents: new Discord.Intents(Discord.Intents.ALL)
  }
};
const client = new Discord.Client(options);

const {DISCORD_TOKEN: TOKEN} = process.env

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", async msg => {
  if (msg.content === "Test") {
    await msg.reply("Successful test");
  }
});

client.login(TOKEN);
