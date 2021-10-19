import Bot from "../bot";

import Player from "./player";

class MusicController extends Map<string, Player> {
  registerVoice(bot: Bot) {
    bot.on("voiceStateUpdate", async (_, state) => {
      const botMember = state.guild.me;
      const members = botMember?.voice?.channel?.members;

      if (!members) return;

      if (Array.from(members).length <= 1) {
        setTimeout(() => {
          const members = botMember?.voice?.channel?.members;

          if (!members) return;

          if (Array.from(members).length <= 1) {
            try {
              controller.get(state.guild.id)!.stop();
            } catch {}
          }
        }, 20 * 1000);
      }
    });
  }
}

const controller = new MusicController();

export default controller;
