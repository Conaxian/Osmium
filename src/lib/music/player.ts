import {
  AudioPlayer,
  createAudioPlayer,
  entersState,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";

import { FullContext } from "../context";
import { $ } from "../loc";

import Audio from "./audio";
import musicController from "./controller";

type LoadedAudio = Required<Audio>;

export default class Player {
  ctx: FullContext;
  connection: VoiceConnection;
  player: AudioPlayer;
  playing?: LoadedAudio;
  queue: LoadedAudio[];
  looping: boolean;

  constructor(ctx: FullContext, connection: VoiceConnection) {
    this.ctx = ctx;
    this.connection = connection;
    this.player = createAudioPlayer();
    this.queue = [];
    this.looping = false;

    musicController.set(ctx.guild!.id, this);

    this.attachNextAudioHandler();
    this.attachDisconnectHandler();
  }

  private attachNextAudioHandler() {
    this.player.on("stateChange", async (_, { status }) => {
      if (status !== "idle") return;

      if (this.length || this.looping) {
        await this.next();
      } else {
        this.playing = undefined;

        const embed = await this.ctx.embed({
          text: $`music/empty-queue`,
          type: "warn",
        });
        await this.ctx.resolveNow({ embeds: embed, reply: false });
      }
    });
  }

  private attachDisconnectHandler() {
    this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(this.connection, VoiceConnectionStatus.Signalling, 2000),
          entersState(
            this.connection,
            VoiceConnectionStatus.Disconnected,
            2000,
          ),
        ]);
      } catch {
        this.stop();
      }
    });
  }

  get length() {
    return this.queue.length;
  }

  async start() {
    if (this.playing) return;

    await this.next();
    this.connection.subscribe(this.player);
  }

  async next() {
    let audio: LoadedAudio;
    if (!this.looping) {
      audio = this.queue.shift()!;
    } else {
      audio = this.playing!;
    }

    await audio.loadResource();
    this.player.play(audio!.resource);
    this.playing = audio;

    if (this.looping) return;

    const embed = await this.ctx.embed({
      text: $`music/playing`.format(audio.escapedTitle),
      type: "music",
    });
    await this.ctx.resolveNow({ embeds: embed, reply: false });
  }

  async add(audio: LoadedAudio) {
    this.queue.push(audio);

    const embed = await this.ctx.embed({
      text: $`music/add-queue`.format(audio.escapedTitle),
      type: "music",
    });
    await this.ctx.resolveNow({ embeds: embed, reply: false });
  }

  async skip() {
    const embed = await this.ctx.embed({
      text: $`music/skipped`.format(this.playing!.escapedTitle),
      type: "music",
    });
    await this.ctx.resolveNow({ embeds: embed, reply: false });

    this.looping = false;
    if (this.queue.length) {
      await this.next();
    } else {
      this.player.stop();
      this.playing = undefined;
    }
  }

  async loop() {
    if (this.looping) return false;
    this.looping = true;

    const embed = await this.ctx.embed({
      text: $`music/looping`.format(this.playing?.escapedTitle),
      type: "music",
    });
    await this.ctx.resolveNow({ embeds: embed, reply: false });

    return true;
  }

  stop() {
    musicController.delete(this.ctx.guild!.id);
    this.player.stop();
    try {
      this.connection.destroy();
    } catch {}
  }
}
