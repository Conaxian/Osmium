"use strict";

const {NodeVM} = require("vm2");
const {performance} = require("perf_hooks");
const Arg = require("../../../lib/cmd/argument");
const {LocStr, LocGroup, LocLengthProxy} = require("../../../lib/locale");
const {MAX_EMBED_DESC_LENGTH, escapeCode} = require("../../../lib/util");
const osm = require("../../../lib/osmapi/osm");

const vm = new NodeVM({
  console: "redirect",
  sandbox: {osm, osmium: osm}
});

module.exports = exports = {
  name: "javascript",
  aliases: [
    "js"
  ],
  args: [
    new Arg("<code>", "js-code")
  ],

  async *invoke(ctx, code) {
    const result = {};
    const start = performance.now();
    try {
      result.text = (vm.run(code) ?? " ").toString();
      const end = performance.now() - start;
      const time = (end / 1000).toFixed(2);
      result.exitCode = new LocStr("mod/tools/javascript/finish-success")
        .format(time);
      result.type = "ok";

    } catch (err) {
      if (/Script execution timed out after \d+ms/.test(err.message)) {
        result.text = new LocStr("mod/tools/python/timeout").format(5);
        result.exitCode = new LocStr("mod/tools/javascript/finish-failure");
        result.type = "error"

      } else {
        const end = performance.now() - start;
        const time = (end / 1000).toFixed(2);
        result.text = err.toString();
        result.exitCode = new LocStr("mod/tools/javascript/finish-success")
          .format(time);
        result.type = "ok"
      }
    }

    const text = new LocLengthProxy(
      escapeCode(result.text),
      MAX_EMBED_DESC_LENGTH,
      "```",
      new LocGroup("```\n", result.exitCode)
    );
    const embed = await ctx.cembed({
      title: new LocStr("mod/tools/javascript/output"),
      text,
      type: result.type
    });
    ctx.resolve({embeds: embed});
  }
};
