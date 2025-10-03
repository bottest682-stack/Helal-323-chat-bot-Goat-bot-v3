const mc = require("minecraft-server-util");

module.exports.config = {
    name: "mc",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Helal",
    description: "Check Minecraft server status",
    commandCategory: "utility",
    usages: "/mc <ip> [port]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    if (args.length < 1) {
        return api.sendMessage("❌ Please provide a server IP.\nUsage: /mc <ip> [port]", event.threadID, event.messageID);
    }

    let ip = args[0];
    let port = args[1] ? parseInt(args[1]) : 25565; // default 25565

    try {
        const result = await mc.status(ip, port, { timeout: 5000 });

        let msg = 
`━━━━━━━━━━━━━━━━━━
🌍 Minecraft Server Info
━━━━━━━━━━━━━━━━━━
📡 Host: ${ip}:${port}
🟢 Status: Online ✅
👥 Players: ${result.players.online}/${result.players.max}
⚙️ Version: ${result.version.name}
💻 Software: ${result.software || "Vanilla/Unknown"}
📊 Ping: ${result.roundTripLatency}ms
━━━━━━━━━━━━━━━━━━
✨ Enjoy your blocky world! ✨`;

        return api.sendMessage(msg, event.threadID, event.messageID);

    } catch (err) {
        return api.sendMessage(
`━━━━━━━━━━━━━━━━━━
🌍 Minecraft Server Info
━━━━━━━━━━━━━━━━━━
📡 Host: ${ip}:${port}
🔴 Status: Offline ❌
━━━━━━━━━━━━━━━━━━`,
            event.threadID,
            event.messageID
        );
    }
};
