import { writeFile } from "fs/promises";
import { join as pathJoin } from "path";

import Argument from "../../../lib/arg";
import Config from "../../../../config";
import { CommandDefinition } from "../../../lib/cmd";
import { SpecialPerm } from "../../../lib/perms";
import { $, $union, $limited, Localizable } from "../../../lib/loc";
import { MAX_EMBED_DESC_LENGTH, shell, escapeCode } from "../../../lib/utils";
import { EmbedType } from "../../../types";

interface IntermediateResult {
  output?: string;
  error?: string;
  unsafeToken?: string;
  execTime?: number;
}

interface ResultData {
  text?: string | Localizable;
  exitCode?: Localizable;
  type?: EmbedType;
}

const pyExecutePath = pathJoin("external", "pyexecute", "cli.py");
const pyFilePath = pathJoin("data", "execute.py");
const pyExecuteCmd = `${Config.pythonCmd} ${pyExecutePath} ${pyFilePath} `;

async function pyExecute(
  code: string,
  scan: boolean,
): Promise<IntermediateResult> {
  await writeFile("data/execute.py", code, { encoding: "utf8" });

  const scanString = scan ? "True" : "False";
  const result = await shell(pyExecuteCmd + scanString);

  if (result.stderr) {
    const unsafeToken = result.stderr.match(
      /^UnsafeCodeError: ([a-zA-Z0-9_]+)\s*$/,
    )?.[1];

    return {
      error: result.stderr.trim(),
      unsafeToken,
    };
  }

  const data = JSON.parse(result.stdout);
  return {
    output: data.stderr || data.stdout || " ",
    execTime: data.execTime,
  };
}

const command: CommandDefinition = {
  name: "python",
  aliases: ["py"],
  args: [new Argument("<code>", "py-code")],

  async *invoke(ctx, code: string) {
    const scan = !(
      /^\s*#dev/.test(code) && ctx.perms.has(SpecialPerm.developer)
    );
    const result = await pyExecute(code, scan);

    const embedData: ResultData = {};

    if (result.error) {
      if (result.unsafeToken) {
        embedData.text = $`mod/tools/python/unsafe-token`.format(
          result.unsafeToken,
        );
      } else {
        embedData.text = $`mod/tools/python/timeout`.format(5);
      }

      embedData.exitCode = $`mod/tools/python/finish-failure`;
      embedData.type = "error";
    } else {
      embedData.text = escapeCode(result.output!);
      embedData.exitCode = $`mod/tools/python/finish-success`.format(
        result.execTime!.toFixed(2),
      );
      embedData.type = "ok";
    }

    const text = $limited(
      embedData.text,
      MAX_EMBED_DESC_LENGTH,
      "```",
      $union("```\n", embedData.exitCode),
    );

    const embed = await ctx.embed({
      title: $`mod/tools/python/output`,
      text,
      type: embedData.type,
    });
    await ctx.resolve({ embeds: embed });
  },
};

export default command;
