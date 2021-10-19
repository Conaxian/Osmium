import { config } from "dotenv";
config();

const { DISCORD_TOKEN } = process.env;

import {
  Client,
  Intents,
  IntentsString,
  PartialTypes,
  ClientOptions,
} from "discord.js";

import Log from "./log";
import { ActivityType } from "../types";
import { musicController } from "./music";

const log = new Log("Bot");

import Config from "../../config";

const allIntents: IntentsString[] = [
  "GUILDS",
  "GUILD_MEMBERS",
  "GUILD_BANS",
  "GUILD_EMOJIS_AND_STICKERS",
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
  "DIRECT_MESSAGE_TYPING",
];

const allPartials: PartialTypes[] = [
  "USER",
  "CHANNEL",
  "GUILD_MEMBER",
  "MESSAGE",
  "REACTION",
];

const options: ClientOptions = {
  intents: new Intents(allIntents),
  partials: allPartials,
  failIfNotExists: false,
};

export default class Bot extends Client {
  constructor() {
    super(options);
  }

  async run() {
    log.info("Starting to log in");
    await super.login(DISCORD_TOKEN);
    log.info(`Logged in as ${this.user!.tag}`);

    this.user!.setActivity(Config.activity);

    musicController.registerVoice(this);
  }

  setActivity(name: string, type: ActivityType) {
    this.user!.setActivity({ name, type });
  }
}
