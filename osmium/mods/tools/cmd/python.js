"use strict";

const fs = require("fs/promises");
const Arg = require("../../../lib/cmd/argument");
const {LocStr, LocTemp} = require("../../../lib/locale");
const {shell, escapeCode} = require("../../../lib/util");
const {pythonCmd} = require("../../../config.json");

const isWin = process.platform == "win32";
const pyexecCommand = pythonCmd + (isWin ?
  " lib\\pyexecute\\cli.py data\\execute.py" :
  " lib/pyexecute/cli.py data/execute.py")

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
    output: data.stderr || data.stdout,
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
    let embed;
    console.log(result);

    if (result.error) {
      let error;
      if (result.unsafeToken) {
        error = new LocStr("mod/tools/python/unsafe-token")
          .format(result.unsafeToken);
      } else {
        error = new LocStr("mod/tools/python/timeout")
          .format(5);
      }

      const exitCode = new LocStr("mod/tools/python/finish-failure");
      const text = new LocTemp("```", error, "```\n", exitCode);
      embed = await ctx.cembed({
        title: new LocStr("mod/tools/python/output"),
        text,
        type: "error"
      });

    } else {
      const output = result.output;
      const exitCode = new LocStr("mod/tools/python/finish-success")
        .format(result.execTime.toFixed(2));
      const text = new LocTemp("```", output, "```\n", exitCode);
      embed = await ctx.cembed({
        title: new LocStr("mod/tools/python/output"),
        text,
        type: "ok"
      })
    }
    await ctx.resolve({embeds: embed});
  }
};
