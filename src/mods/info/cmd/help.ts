import { MessageEmbed } from "discord.js";

import Command, { CommandDefinition } from "../../../lib/cmd";
import Module, { loadedModules } from "../../../lib/mod";
import Argument from "../../../lib/arg/argument";
import { CembedField } from "../../../lib/context";
import { $, $union, Localizable } from "../../../lib/loc";
import { stabilizeFields } from "../../../lib/utils";

const command: CommandDefinition = {
  name: "help",
  aliases: ["h"],
  args: [new Argument("[scope]", "command-module")],

  async *invoke(ctx, scope: Command | Module | undefined) {
    let embed: MessageEmbed;
    const fields: CembedField[] = [];

    if (!scope) {
      for (const mod of loadedModules.values()) {
        if (mod.hidden) continue;

        const text = $`mod/info/help/module-help`.format(
          $`mod/${mod.name}/desc`,
          ctx.prefix,
          mod.name,
        );

        fields.push({
          name: $`mod/${mod.name}/name`,
          value: text,
        });
      }

      stabilizeFields(fields);

      embed = await ctx.embed({
        title: $`mod/info/help/name`,
        text: $`mod/info/help/module-list`,
        fields,
        type: "info",
      });
    } else if (scope instanceof Module) {
      for (const command of scope.commands) {
        fields.push({
          name: $`mod/${scope.name}/${command.name}/name`,
          value: `\`${ctx.prefix}help ${command.name}\``,
        });
      }

      stabilizeFields(fields);

      const name = $`mod/${scope.name}/name`;
      embed = await ctx.embed({
        title: $`mod/info/help/name`,
        text: $`mod/info/help/command-list`.format(name),
        fields,
        type: "info",
      });
    } else {
      fields.push({
        name: $`mod/info/help/syntax`,
        value: `\`${ctx.prefix}${scope.syntax}\``,
        inline: false,
      });

      const none = $`general/none`;
      const aliases = scope.aliases.length
        ? "`" + scope.aliases.join("`, `") + "`"
        : none;

      fields.push({
        name: $`mod/info/help/aliases`,
        value: aliases,
        inline: false,
      });

      const perms: (string | Localizable)[] = [];
      scope.perms.forEach((perm, i) => {
        if (i) perms.push(", ");
        perms.push($`perms/${perm}`);
      });

      fields.push({
        name: $`mod/info/help/perms`,
        value: perms.length ? $union(...perms) : none,
        inline: false,
      });

      embed = await ctx.embed({
        title: $`mod/${scope.mod.name}/${scope.name}/name`,
        text: $`mod/${scope.mod.name}/${scope.name}/desc`.format(
          ...scope.args.map((arg) => arg.displayName),
        ),
        fields,
        type: "info",
      });
    }

    await ctx.resolve({ embeds: embed });
  },
};

export default command;
