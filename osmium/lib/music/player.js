"use strict";

const { createAudioPlayer } = require("@discordjs/voice");
const { LocStr } = require("../locale");
const { escapeMd } = require("../util");

const players = new Map();

class Player {
  constructor(ctx) {
    this.ctx = ctx;
    this.player = createAudioPlayer();
    this.started = false;
    this.queue = [];
    players.set(ctx.guild.id, this);

    this.player.on("stateChange", async (_, { status }) => {
      if (status === "idle" && this.queue.length) {
        await this.next();
      }
    });
  }

  start(connection) {
    if (this.started) return;
    this.started = true;
    this.next();
    connection.subscribe(this.player);
  }

  async next() {
    const audio = this.queue.shift();
    this.player.play(audio.resource);
    const embed = await this.ctx.cembed({
      text: new LocStr("music/playing")
        .format(escapeMd(audio.title)),
      type: "info"
    });
    await this.ctx.out(this.ctx.output({embeds: embed}, false));
  }

  async add(audio) {
    this.queue.push(audio);
    const embed = await this.ctx.cembed({
      text: new LocStr("music/add-queue")
        .format(escapeMd(audio.title)),
      type: "info"
    });
    await this.ctx.out(this.ctx.output({embeds: embed}, false));
  }

  get length() {
    return this.queue.length;
  }

  stop() {
    this.player.stop();
    players.delete(this.ctx.guild.id);
  }
}

function guildPlayer(id) {
  return players.get(id);
}

module.exports = exports = { Player, guildPlayer };
