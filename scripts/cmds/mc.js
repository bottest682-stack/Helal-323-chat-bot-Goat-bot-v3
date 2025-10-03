const util = require("minecraft-server-util");

module.exports = {
  config: {
    name: "mc",
    version: "2.0",
    author: "Helal",
    countDown: 5,
    role: 0,
    description: "Check Minecraft server info (Java + Bedrock)",
    category: "utility",
    guide: {
      en: "{pn} <ip:port>"
    }
  },

  onStart: async function ({ message, args }) {
    if (args.length === 0) return message.reply("⚠️ Example: /mc play.hypixel.net অথবা /mc play.example.net:19132");

    let input = args[0].split(":");
    let host = input[0];
    let port = input[1] ? parseInt(input[1]) : 25565;

    // প্রথমে Java server চেক করবো
    try {
      const javaStatus = await util.status(host, port, { timeout: 5000 });

      let playersList = javaStatus.players.sample 
        ? javaStatus.players.sample.map((p, i) => `${i + 1}. ${p.name}`).slice(0, 10).join("\n") 
        : "❌ Online players দেখানো যাচ্ছে না";

      return message.reply(
`✅ Server is ONLINE (Java Edition)
📡 IP: ${host}:${port}
🖥 Software: Java
🎮 Version: ${javaStatus.version.name}
👥 Players: ${javaStatus.players.online}/${javaStatus.players.max}

👤 Online Players (Top 10):
${playersList}`
      );
    } catch (err1) {
      try {
        // যদি Java fail করে → Bedrock ধরবে
        const bedrockStatus = await util.statusBedrock(host, port || 19132, { timeout: 5000 });

        return message.reply(
`✅ Server is ONLINE (Bedrock Edition)
📡 IP: ${host}:${port || 19132}
🖥 Software: Bedrock
🎮 Version: ${bedrockStatus.version.name}
👥 Players: ${bedrockStatus.players.online}/${bedrockStatus.players.max}

⚠️ Note: Bedrock এ player list দেখানো যায় না`
        );
      } catch (err2) {
        return message.reply("❌ Server is offline or unreachable!");
      }
    }
  }
};
