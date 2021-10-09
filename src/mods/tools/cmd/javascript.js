"use strict";

const { NodeVM } = require("vm2");
const fs = require("fs/promises");
const { performance } = require("perf_hooks");
const Arg = require("../../../lib/cmd/argument");
const { $, $union, $limited } = require("../../../lib/loc");
const {
  MAX_EMBED_DESC_LENGTH,
  shell,
  escapeTemplateStr,
  escapeCode,
} = require("../../../lib/utils");

const isWin = process.platform === "win32";
const nodeCommand = "node " + (isWin ? "data\\execute.js" : "data/execute.js");

async function jsExecute(code) {
  code = escapeTemplateStr(code);
  code = `const{NodeVM}=require("vm2");
const vm=new NodeVM({});
vm.run(\`${code}\`);
`;
  await fs.writeFile("data/execute.js", code, { encoding: "utf8" });

  const start = performance.now();
  let result;
  try {
    result = await shell(nodeCommand, { timeout: 5000 });
  } catch (err) {
    result = { stdout: "", stderr: err };
  }
  const time = performance.now() - start;

  if (result.stderr.killed) {
    return {
      text: $`mod/tools/python/timeout`.format(5),
      exitCode: $`mod/tools/javascript/finish-failure`,
      type: "error",
    };
  }

  const output = result.stderr.toString() || result.stdout.trim() || " ";
  return {
    text: escapeCode(output),
    exitCode: $`mod/tools/javascript/finish-success`.format(
      (time / 1000).toFixed(2),
    ),
    type: "ok",
  };
}

module.exports = exports = {
  name: "javascript",
  aliases: ["js"],
  args: [new Arg("<code>", "js-code")],

  async *invoke(ctx, code) {
    const result = await jsExecute(code);

    const text = $limited(
      result.text,
      MAX_EMBED_DESC_LENGTH,
      "```",
      $union("```\n", result.exitCode),
    );
    const embed = await ctx.embed({
      title: $`mod/tools/javascript/output`,
      text,
      type: result.type,
    });
    ctx.resolve({ embeds: embed });
  },
};
