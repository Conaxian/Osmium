"use strict";

const axios = require("axios");
const Arg = require("../../../lib/cmd/argument");
const { $ } = require("../../../lib/loc");
const { urlShortener, shortUrl } = require("../../../../config.json");

module.exports = exports = {
  name: "shorten",
  aliases: [
    "short",
    "shorturl",
    "tinyurl",
  ],
  args: [
    new Arg("<url>", "word"),
  ],

  async *invoke(ctx, url) {
    const query = "?url=" + url;
    let urlId;
    try {
      const resp = await axios.get(urlShortener + query);
      urlId = resp.data.id;
    } catch {}
    let embed;
    if (!urlId) {
      embed = await ctx.cembed({
        text: $`mod/tools/shorten/bad-url`,
        type: "error",
      });
    } else {
      embed = await ctx.cembed({
        title: $`mod/tools/shorten/name`,
        text: shortUrl + urlId,
        type: "ok",
      });
    }
    ctx.resolve({ embeds: embed });
  }
};
