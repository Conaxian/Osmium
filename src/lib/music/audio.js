"use strict";

const { createAudioResource } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const { hhmmss } = require("../timestamp");

class Audio {
  constructor(url, requestor) {
    this.url = url;
    this.requestor = requestor;
  }

  async init() {
    this.info = await ytdl.getBasicInfo(this.url);
    const info = this.info.player_response.videoDetails;
    this.title = info.title;
    this.id = info.videoId;
    this.author = info.author;
    this.length = +info.lengthSeconds;
    this.desc = info.shortDescription;
    this.resource = createAudioResource(ytdl(this.url, {
      quality: "highestaudio",
      highWaterMark: 1024 * 1024 * 10
    }));
  }

  get duration() {
    const date = new Date(this.length * 1000);
    return hhmmss(date);
  }
}

async function ytSearch(query) {
  const results = await ytsr(query, {limit: 10});
  for (let result of results.items) {
    if (result.type === "video") {
      return result.url;
    }
  }
}

module.exports = exports = { Audio, ytSearch };
