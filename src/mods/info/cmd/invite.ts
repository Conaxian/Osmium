import { CommandDefinition } from "../../../lib/cmd";

const INVITE_URL = "https://discord.gg/";

const command: CommandDefinition = {
  name: "invite",

  async *invoke(ctx) {
    const vanityCode = ctx.guild!.vanityURLCode;

    const invite = vanityCode
      ? INVITE_URL + vanityCode
      : (
          await ctx.channel.createInvite({
            maxAge: 0,
            reason: `Created by ${ctx.authorUser.tag}`,
          })
        ).url;

    await ctx.resolve({ text: invite });
  },
};

export default command;
