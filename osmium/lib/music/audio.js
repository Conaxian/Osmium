"use strict";

const { createAudioResource } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");

class Audio {
  constructor(url) {
    this.url = url;
  }

  async init() {
    this.info = await ytdl.getBasicInfo(this.url);
    const info = this.info.player_response.videoDetails;
    this.title = info.title;
    this.id = info.videoId;
    this.author = info.author;
    this.length = +info.lengthSeconds;
    this.desc = info.shortDescription;
    this.resource = createAudioResource(ytdl(this.url));
  }
}

async function ytSearch(query) {
  return (await ytsr(query, {limit: 1})).items?.[0]?.url;
}

module.exports = exports = { Audio, ytSearch };
