"use strict";

require("dotenv").config();
const {DISCORD_TOKEN: TOKEN} = process.env;
const {activity} = require("../config.json");

const Log = require("./log.js");
const log = new Log("Bot");

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
const allPartials = [
  "USER",
  "CHANNEL",
  "GUILD_MEMBER",
  "MESSAGE",
  "REACTION"
];
const options = {
  intents: new Intents(allIntents),
  partials: allPartials
};

module.exports = exports = class Bot extends Client {
  constructor() {
    super(options);
  }

  async run(presence) {
    log.info("Starting to log in");
    await super.login(TOKEN);
    log.info(`Logged in as ${this.user.tag}`)
    this.user.setActivity(activity);
  }
}
