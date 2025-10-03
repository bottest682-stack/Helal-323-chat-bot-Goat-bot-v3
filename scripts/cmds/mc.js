const { lookup } = require("node:dns").promises;
const mc = require("minecraft-server-util");

module.exports = {
  config: {
    name: "mc",
    version: "1.3",
    author: "Helal",
    countDown: 5,
    role: 0,
    description: "Check Minecraft server status",
    category: "Utility",
    guide: {
      en: "{pn} <ip:port>"
    }
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("⚠️ | Please provide server IP!\nExample: /mc play.hypixel.net:25565");

    let [host, port] = args[0].split(":");
    port = port ? parseInt(port) : 25565;

    try {
      // Java Server check
      const result = await mc.status(host, port, { timeout: 5000 });
      const hosting = await detectHosting(host);

      let msg = `✅ Server is **Online**!\n\n` +
        `🌐 IP: ${host}:${port}\n` +
        `🖥️ Software: ${result.software || "Unknown"}\n` +
        `🎮 Version: ${result.version.name}\n` +
        `👥 Players: ${result.players.online}/${result.players.max}\n` +
        `📡 Hosting: ${hosting}\n\n`;

      if (result.players.sample && result.players.sample.length > 0) {
        msg += `👤 Online Players:\n${result.players.sample.map(p => `- ${p.name}`).join("\n")}`;
      } else {
        msg += `😔 No players online right now.`;
      }

      return message.reply(msg);

    } catch (e) {
      // Bedrock Fallback
      try {
        const result = await mc.statusBedrock(host, port, { timeout: 5000 });
        const hosting = await detectHosting(host);

        let msg = `✅ Bedrock Server is **Online**!\n\n` +
          `🌐 IP: ${host}:${port}\n` +
          `🎮 Version: ${result.version.name} (${result.version.protocol})\n` +
          `👥 Players: ${result.players.online}/${result.players.max}\n` +
          `📡 Hosting: ${hosting}`;

        return message.reply(msg);

      } catch {
        return message.reply("❌ | Server is offline or unreachable.");
      }
    }
  }
};

// Detect Hosting Provider
async function detectHosting(host) {
  try {
    const res = await lookup(host);
    const ip = res.address;

    if (host.includes("aternos")) return "🌍 Aternos Free Hosting";
    if (host.includes("pebblehost")) return "💎 Pebblehost";
    if (host.includes("shockbyte")) return "⚡ Shockbyte";
    if (host.includes("minehut")) return "🏝️ Minehut";
    if (ip.startsWith("51.")) return "🇫🇷 OVH Hosting";
    if (ip.startsWith("104.") || ip.startsWith("172.")) return "☁️ Cloudflare Proxy";

    return `🛰️ ${ip}`;
  } catch {
    return "Unknown Hosting";
  }
          }
