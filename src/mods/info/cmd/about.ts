import Config from "../../../../config";
import { CommandDefinition } from "../../../lib/cmd";
import { $ } from "../../../lib/loc";
import { version } from "../../../lib/utils";

const command: CommandDefinition = {
  name: "about",
  aliases: ["osmium", "github", "version"],

  async *invoke(ctx) {
    const text = $`mod/info/about/text`.format(Config.author);
    const fields = [];

    fields.push({
      name: $`mod/info/about/add-bot`,
      value: Config.botInvite,
    });

    fields.push({
      name: $`mod/info/about/github`,
      value: Config.gitHub,
    });

    fields.push({
      name: $`mod/info/about/version`,
      value: `**\`v${version}\`**`,
    });

    const embed = await ctx.embed({
      title: $`mod/info/about/name`,
      text,
      fields,
      type: "info",
    });
    await ctx.resolve({ embeds: embed });
  }
};

export default command;
