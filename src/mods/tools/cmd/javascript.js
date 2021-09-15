"use strict";

const {NodeVM} = require("vm2");
const fs = require("fs/promises");
const {performance} = require("perf_hooks");
const Arg = require("../../../lib/cmd/argument");
const {LocStr, LocGroup, LocLengthProxy} = require("../../../lib/locale");
const {
  MAX_EMBED_DESC_LENGTH,
  shell,
  escapeTemplateString,
  escapeCode
} = require("../../../lib/util");

const isWin = process.platform === "win32";
const nodeCommand = "node " + (isWin ?
  "data\\execute.js" : "data/execute.js")

async function jsExecute(code) {
  code = escapeTemplateString(code);
  code = `const{NodeVM}=require("vm2");
const vm=new NodeVM({});
vm.run(\`${code}\`);
`;
  await fs.writeFile("data/execute.js", code, {encoding: "utf8"});

  const start = performance.now();
  let result;
  try {
    result = await shell(nodeCommand, {timeout: 5000});
  } catch (err) {
    result = {stdout: "", stderr: err};
  }
  const time = performance.now() - start;

  if (result.stderr.killed) {
    return {
      text: new LocStr("mod/tools/python/timeout").format(5),
      exitCode: new LocStr("mod/tools/javascript/finish-failure"),
      type: "error"
    };
  }

  const output = result.stderr.toString() || result.stdout.trim() || " ";
  return {
    text: escapeCode(output),
    exitCode: new LocStr("mod/tools/javascript/finish-success")
      .format((time / 1000).toFixed(2)),
    type: "ok"
  };
}

module.exports = exports = {
  name: "javascript",
  aliases: [
    "js"
  ],
  args: [
    new Arg("<code>", "js-code")
  ],

  async *invoke(ctx, code) {
    const result = await jsExecute(code);

    const text = new LocLengthProxy(
      result.text,
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
