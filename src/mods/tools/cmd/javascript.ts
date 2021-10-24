import { writeFile } from "fs/promises";
import { join as pathJoin } from "path";
import { performance } from "perf_hooks";

import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";
import { $, $union, $limited, Localizable } from "../../../lib/loc";
import {
  MAX_EMBED_DESC_LENGTH,
  shell,
  escapeTemplateStr,
  escapeCode,
} from "../../../lib/utils";
import { EmbedType } from "../../../types";

interface ExecutionResult {
  stdout: string;
  stderr: any;
}

interface ResultData {
  text: string | Localizable;
  exitCode: Localizable;
  type: EmbedType;
}

const nodeCommand = "node " + pathJoin("data", "execute.js");

async function jsExecute(code: string): Promise<ResultData> {
  code = escapeTemplateStr(code);
  code = `const{NodeVM}=require("vm2");
const vm=new NodeVM({});
vm.run(\`${code}\`);
`;

  await writeFile("data/execute.js", code, { encoding: "utf8" });

  const start = performance.now();

  let result: ExecutionResult;
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

  const output: string =
    result.stderr.toString() || result.stdout.trim() || " ";

  return {
    text: escapeCode(output),
    exitCode: $`mod/tools/javascript/finish-success`.format(
      (time / 1000).toFixed(2),
    ),
    type: "ok",
  };
}

const command: CommandDefinition = {
  name: "javascript",
  aliases: ["js"],
  args: [new Argument("<code>", "js-code")],

  async *invoke(ctx, code: string) {
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
    await ctx.resolve({ embeds: embed });
  },
};

export default command;
