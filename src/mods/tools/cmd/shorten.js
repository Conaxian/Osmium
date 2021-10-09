"use strict";

const axios = require("axios");
const { stringify: queryEncode } = require("querystring");
const Arg = require("../../../lib/cmd/argument");
const { $ } = require("../../../lib/loc");
const { urlShortener, shortUrl } = require("../../../../config");

module.exports = exports = {
  name: "shorten",
  aliases: ["short", "shorturl", "tinyurl"],
  args: [new Arg("<url>", "word")],

  async *invoke(ctx, url) {
    const query = "?" + queryEncode({ url: url });
    let urlId;
    try {
      const resp = await axios.get(urlShortener + query);
      urlId = resp.data.id;
    } catch {}
    let embed;
    if (!urlId) {
      embed = await ctx.embed({
        text: $`mod/tools/shorten/bad-url`,
        type: "error",
      });
    } else {
      embed = await ctx.embed({
        title: $`mod/tools/shorten/name`,
        text: shortUrl + urlId,
        type: "ok",
      });
    }
    ctx.resolve({ embeds: embed });
  },
};
