import ytdl from "ytdl-core";
import ytsr from "ytsr";
import {
  demuxProbe,
  createAudioResource,
  AudioResource,
} from "@discordjs/voice";

import Config from "../../../config";
import { hhmmss } from "../timestamp";
import { escapeMd } from "../utils";

const youtubeUrlRegExp =
  /^https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?$/;

const ytdlHeaders = {
  Cookie: Config.youtubeCookie,
};

export default class Audio {
  url: string;
  requestor: string;
  info?: ytdl.videoInfo;
  title?: string;
  id?: string;
  author?: string;
  length?: number;
  desc?: string;
  resource?: AudioResource<null>;

  constructor(url: string, requestor: string) {
    this.url = url;
    this.requestor = requestor;
  }

  async init() {
    this.info = await ytdl.getBasicInfo(this.url, {
      requestOptions: { headers: ytdlHeaders },
    });
    const info = this.info.player_response.videoDetails;

    this.title = info.title;
    this.id = info.videoId;
    this.author = info.author;
    this.length = +info.lengthSeconds;
    this.desc = info.shortDescription;

    this.resource = await this.loadResource();
  }

  get duration() {
    const date = new Date((this.length ?? 0) * 1000);
    return hhmmss(date);
  }

  get escapedTitle() {
    return escapeMd(this.title ?? "");
  }

  static async fromYoutube(query: string, requestor: string) {
    if (youtubeUrlRegExp.test(query)) {
      return new Audio(query, requestor);
    };

    const results = await ytsr(query, { limit: 10 });
    for (const result of results.items) {
      if (result.type === "video") {
        return new Audio(result.url, requestor);
      };
    }

    return null;
  }

  private async loadResource() {
    const stream = ytdl(this.url, {
      quality: "highestaudio",
      highWaterMark: 1 << 25,
      requestOptions: { headers: ytdlHeaders },
    });

    const { stream: probedStream, type } = await demuxProbe(stream);
    return createAudioResource(probedStream, { inputType: type });
  }
}
