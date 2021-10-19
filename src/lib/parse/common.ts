import Context, { ArgsObject } from "../context";
import Config from "../../../config";
import { ArgError, FormatterOutput } from "../arg";
import { $ } from "../loc";
import { mentionId, escapeRegExp } from "../utils";
import { callNamespace } from "../mod";

const callTimes = new Map();

export async function replyPrefix(ctx: Context) {
  if (mentionId(ctx.text) !== ctx.bot.user!.id) return;

  const prefix = ctx.prefix ?? Config.prefix;

  const embed = await ctx.embed({
    text: $`parser/current-prefix`.format(prefix),
    type: "info",
  });

  await ctx.resolve({ embeds: embed });
}

export async function getCmd(ctx: Context) {
  const escPrefix = escapeRegExp(ctx.prefix);
  const prefixPattern = `^${escPrefix}[ \t]*([a-zA-Z0-9_-]+)`;

  const commandRegExp = new RegExp(prefixPattern);
  const match = ctx.text.match(commandRegExp);

  if (!match) return;

  if (ctx.msg) {
    const callTime = callTimes.get(ctx.author!.id);
    const now = Date.now();

    if (callTime > now - Config.cmdCooldown) return;
    callTimes.set(ctx.author!.id, now);
  }

  const call = match[1].toLowerCase().replace(/_/g, "-");
  ctx.command = callNamespace.get(call);

  if (!ctx.command) {
    return await ctx.error($`parser/unknown-command`.format(ctx.prefix));
  }

  if (!ctx.perms.has(ctx.command.perms)) {
    return await ctx.error($`parser/missing-perms-user`);
  }

  const argString = ctx.text.replace(commandRegExp, "").trim();
  ctx.args = (await getArgs(ctx, argString)) ?? {};
}

async function getArgs(ctx: Context, argString: string) {
  const args: ArgsObject = {};

  for (const arg of ctx.command!.args) {
    let result: FormatterOutput;

    try {
      result = await arg.parse(ctx, argString);
    } catch (err) {
      if (!(err instanceof ArgError)) throw err;

      const error = err as ArgError;

      await ctx.error(
        $`parser/invalid-value`.format(
          arg.displayName,
          error.value,
          $`arg-format/${error.arg.formatName}`,
        ),
      );
      break;
    }

    if (result.code === "MISSING") {
      if (arg.optional) break;

      await ctx.error($`parser/missing-arg`.format(arg.displayName));
      break;
    }

    args[arg.name] = result.value;
    argString = result.remainder.trim();
  }

  return args;
}
