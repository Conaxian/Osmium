"use strict";

const { createAudioPlayer, entersState } = require("@discordjs/voice");
const { LocStr } = require("../locale");
const { escapeMd } = require("../util");

const players = new Map();

class Player {
  constructor(ctx, connection) {
    this.ctx = ctx;
    this.connection = connection;
    this.player = createAudioPlayer();
    this.playing = null;
    this.queue = [];
    players.set(ctx.guild.id, this);

    this.player.on("stateChange", async (_, { status }) => {
      if (status === "idle") {
        if (this.queue.length) {
          await this.next();
        } else {
          this.playing = null;
          const embed = await this.ctx.cembed({
            text: new LocStr("music/empty-queue"),
            type: "error"
          });
          await this.ctx.out(this.ctx.output({embeds: embed}, false));
        }
      }
    });

    this.connection.on("disconnected", async () => {
      try {
        await Promise.race([
          entersState(this.connection, "signalling", 2000),
          entersState(this.connection, "connecting", 2000)
        ]);
      } catch (error) {
        this.stop();
      }
    });
  }

  get length() {
    return this.queue.length;
  }

  start() {
    if (this.playing) return;
    this.next();
    this.connection.subscribe(this.player);
  }

  async next() {
    const audio = this.queue.shift();
    this.player.play(audio.resource);
    this.playing = audio;
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

  async skip() {
    const embed = await this.ctx.cembed({
      text: new LocStr("music/skipped")
        .format(escapeMd(this.playing.title)),
      type: "info"
    });
    await this.ctx.out(this.ctx.output({embeds: embed}, false));

    if (this.queue.length) {
      await this.next();
    } else {
      this.player.stop();
      this.playing = null;
    }
  }

  stop() {
    players.delete(this.ctx.guild.id);
    this.player.stop();
    try {
      this.connection.destroy();
    } catch {}
  }
}

function guildPlayer(id) {
  return players.get(id);
}

module.exports = exports = { Player, guildPlayer };
