"use strict";

const { createAudioPlayer, entersState } = require("@discordjs/voice");
const { $ } = require("../loc");
const { escapeMd } = require("../utils");

const players = new Map();

function voiceInit(bot) {
  bot.on("voiceStateUpdate", async (_, state) => {
    const botMember = state.guild.me;
    const members = botMember?.voice?.channel?.members;
    if (!members) return;
    if (Array.from(members).length <= 1) {
      setTimeout(() => {
        const members = botMember?.voice?.channel?.members;
        if (!members) return;
        if (Array.from(members).length <= 1) {
          try {
            guildPlayer(state.guild.id).stop();
          } catch {}
        }
      }, 20 * 1000);
    }
  });
}

function guildPlayer(id) {
  return players.get(id);
}

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
            text: $`music/empty-queue`,
            type: "error",
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
      text: $`music/playing`.format(escapeMd(audio.title)),
      type: "info",
    });
    await this.ctx.out(this.ctx.output({embeds: embed}, false));
  }

  async add(audio) {
    this.queue.push(audio);
    const embed = await this.ctx.cembed({
      text: $`music/add-queue`.format(escapeMd(audio.title)),
      type: "info",
    });
    await this.ctx.out(this.ctx.output({embeds: embed}, false));
  }

  async skip() {
    const embed = await this.ctx.cembed({
      text: $`music/skipped`.format(escapeMd(this.playing.title)),
      type: "info",
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

module.exports = exports = { players, voiceInit, guildPlayer, Player };
