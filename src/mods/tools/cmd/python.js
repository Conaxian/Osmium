"use strict";

const fs = require("fs/promises");
const Arg = require("../../../lib/cmd/argument");
const { $, $union, $limited } = require("../../../lib/loc");
const {
  MAX_EMBED_DESC_LENGTH,
  shell,
  escapeCode
} = require("../../../lib/utils");
const {pythonCmd} = require("../../../../config.json");

const isWin = process.platform === "win32";
const pyexecCommand = pythonCmd + (isWin ?
  " external\\pyexecute\\cli.py data\\execute.py" :
  " external/pyexecute/cli.py data/execute.py")

async function pyExecute(code, scan) {
  await fs.writeFile("data/execute.py", code, {encoding: "utf8"});
  const scanString = scan ? " True" : " False";
  const result = await shell(pyexecCommand + scanString);

  if (result.stderr) {
    const unsafeToken = result.stderr
      .match(/^UnsafeCodeError: ([a-zA-Z0-9_]+)\s*$/)?.[1];
    return {
      error: result.stderr.trim(),
      unsafeToken
    };
  }

  const data = JSON.parse(result.stdout);
  return {
    output: data.stderr || data.stdout || " ",
    execTime: data.execTime
  };
}

module.exports = exports = {
  name: "python",
  aliases: [
    "py"
  ],
  args: [
    new Arg("<code>", "py-code")
  ],

  async *invoke(ctx, code) {
    const scan = !(/^\s*#dev/.test(code) && ctx.perms.has("developer"));
    const result = await pyExecute(code, scan);
    const embedData = {};

    if (result.error) {
      if (result.unsafeToken) {
        embedData.text = $`mod/tools/python/unsafe-token`
          .format(result.unsafeToken);
      } else {
        embedData.text = $`mod/tools/python/timeout`.format(5);
      }

      embedData.exitCode = $`mod/tools/python/finish-failure`;
      embedData.type = "error";

    } else {
      embedData.text = escapeCode(result.output);
      embedData.exitCode = $`mod/tools/python/finish-success`
        .format(result.execTime.toFixed(2));
      embedData.type = "ok";
    }

    const text = $limited(
      embedData.text,
      MAX_EMBED_DESC_LENGTH,
      "```",
      $union("```\n", embedData.exitCode),
    );
    const embed = await ctx.cembed({
      title: $`mod/tools/python/output`,
      text,
      type: embedData.type,
    });
    ctx.resolve({ embeds: embed });
  }
};
