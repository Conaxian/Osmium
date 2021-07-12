"use strict";

require("dotenv").config();
const {DISCORD_TOKEN: TOKEN} = process.env;

const {Client, Intents} = require("discord.js");
const allIntents = [
  "GUILDS",
  "GUILD_MEMBERS",
  "GUILD_BANS",
  "GUILD_EMOJIS",
  "GUILD_INTEGRATIONS",
  "GUILD_WEBHOOKS",
  "GUILD_INVITES",
  "GUILD_VOICE_STATES",
  "GUILD_PRESENCES",
  "GUILD_MESSAGES",
  "GUILD_MESSAGE_REACTIONS",
  "GUILD_MESSAGE_TYPING",
  "DIRECT_MESSAGES",
  "DIRECT_MESSAGE_REACTIONS",
  "DIRECT_MESSAGE_TYPING"
];
const options = {
  intents: new Intents(allIntents)
};

class Bot extends Client {
  constructor() {
    super(options);
  }
}

module.exports = exports = {Bot, TOKEN};
