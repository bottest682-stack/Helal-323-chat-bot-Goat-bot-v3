const axios = require("axios");

module.exports = {
  config: {
    name: "mc",
    version: "1.3",
    author: "Helal",
    countDown: 5,
    role: 0,
    description: {
      en: "Check Minecraft server status with player list"
    },
    category: "Utility",
    guide: {
      en: "{pn} <ip> [port]"
    }
  },

  langs: {
    en: {
      missingIP: "❌ Please provide server IP. Example: /mc play.hypixel.net",
      checking: "⏳ Checking server status...",
      offline: "❌ Server is offline or unreachable.",
      online: "✅ Server is online!\n📡 IP: {ip}:{port}\n🖥 Software: {software}\n🎮 Version: {version}\n👥 Players: {players}/{max}\n\n{playerList}",
      error: "⚠️ Error: {err}"
    }
  },

  onStart: async function({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("missingIP"));
    const ip = args[0];
    const port = args[1] || 25565;

    await message.reply(getLang("checking"));

    try {
      const res = await axios.get(`https://api.mcsrvstat.us/2/${ip}`);
      const data = res.data;

      if (!data.online) {
        return message.reply(getLang("offline"));
      }

      const playersOnline = data.players?.online || 0;
      const playersMax = data.players?.max || 0;
      const version = data.version || "Unknown";
      const software = data.software || "Unknown";

      // Player list
      let playerList = "🙃 No players online right now.";
      if (data.players?.list && data.players.list.length > 0) {
        playerList = "👥 Online Players:\n" + data.players.list.map((p, i) => `${i+1}. ${p}`).join("\n");
      }

      let msg = getLang("online")
        .replace("{ip}", ip)
        .replace("{port}", port)
        .replace("{software}", software)
        .replace("{version}", version)
        .replace("{players}", playersOnline)
        .replace("{max}", playersMax)
        .replace("{playerList}", playerList);

      return message.reply(msg);

    } catch (err) {
      console.error("MC status error:", err);
      return message.reply(getLang("error").replace("{err}", err.message));
    }
  }
};
