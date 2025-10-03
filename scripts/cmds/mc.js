const axios = require("axios");

module.exports = {
  config: {
    name: "mc",
    version: "1.2",
    author: "Helal",
    countDown: 5,
    role: 0,
    description: { en: "Check Minecraft server status (debug)" },
    category: "Utility",
    guide: { en: "{pn} <ip> [port]" }
  },

  langs: {
    en: {
      missingIP: "❌ Please provide server IP. Example: /mc play.hypixel.net",
      checking: "⏳ Checking server...",
      offline: "❌ Server is offline or unreachable.",
      online: "✅ Server is online!\nPlayers: {players}/{max}\nVersion: {version}\nSoftware: {software}\nIP: {ip}:{port}",
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
      // debug log console
      console.log("MC API response:", JSON.stringify(data, null, 2));

      if (!data.online) {
        return message.reply(getLang("offline"));
      }

      const playersOnline = data.players?.online || 0;
      const playersMax = data.players?.max || 0;
      const version = data.version || "Unknown";
      const software = data.software || "Unknown";

      let msg = getLang("online")
        .replace("{players}", playersOnline)
        .replace("{max}", playersMax)
        .replace("{version}", version)
        .replace("{software}", software)
        .replace("{ip}", ip)
        .replace("{port}", port);

      return message.reply(msg);

    } catch (err) {
      console.error("MC status error:", err);
      return message.reply(getLang("error").replace("{err}", err.message));
    }
  }
};
