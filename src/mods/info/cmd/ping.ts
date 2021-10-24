import { CommandDefinition } from "../../../lib/cmd";
import { $ } from "../../../lib/loc";

const command: CommandDefinition = {
  name: "ping",
  aliases: ["test"],

  async *invoke(ctx) {
    const initialEmbed = await ctx.embed({
      title: $`mod/info/ping/name`,
      text: $`mod/info/ping/text`.format("..."),
      type: "loading",
    });

    const msg = yield await ctx.output({ embeds: initialEmbed });
    const ping = msg.createdTimestamp - ctx.msg.createdTimestamp;

    const editedEmbed = await ctx.embed({
      title: $`mod/info/ping/pong`,
      text: $`mod/info/ping/text`.format(ping),
      type: "ok",
    });

    const edited = await ctx.output({ embeds: editedEmbed });
    await ctx.edit(msg, edited);
  },
};

export default command;
