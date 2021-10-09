"use strict";

const { demuxProbe, createAudioResource } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const { hhmmss } = require("../timestamp");
const { youtubeCookie } = require("../../../config");

async function createResource(stream) {
  const { stream: newStream, type } = await demuxProbe(stream);
  return createAudioResource(newStream, { inputType: type });
}

class Audio {
  constructor(url, requestor) {
    this.url = url;
    this.requestor = requestor;
  }

  async init() {
    this.info = await ytdl.getBasicInfo(this.url, {
      requestOptions: { headers: { Cookie: youtubeCookie } },
    });
    const info = this.info.player_response.videoDetails;
    this.title = info.title;
    this.id = info.videoId;
    this.author = info.author;
    this.length = +info.lengthSeconds;
    this.desc = info.shortDescription;
    await this.loadResource();
  }

  get duration() {
    const date = new Date(this.length * 1000);
    return hhmmss(date);
  }

  async loadResource() {
    this.resource = await createResource(
      ytdl(this.url, {
        quality: "highestaudio",
        highWaterMark: 1024 * 1024 * 10,
        requestOptions: { headers: { Cookie: youtubeCookie } },
      }),
    );
  }
}

const youtubeUrlRegExp = new RegExp(
  [
    "https?:\\/\\/(?:www\\.)?youtu(?:be\\.com\\/watch\\?v=|\\.be\\/)",
    "([\\w\\-\\_]*)(&(amp;)[\\w\\=]*)?",
  ].join(""),
);

async function ytSearch(query) {
  if (youtubeUrlRegExp.test(query)) return query;
  const results = await ytsr(query, { limit: 10 });
  for (let result of results.items) {
    if (result.type === "video") {
      return result.url;
    }
  }
}

module.exports = exports = { Audio, ytSearch };
