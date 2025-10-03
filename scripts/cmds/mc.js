const Gamedig = require("gamedig");

module.exports = {
	config: {
		name: "mc",
		version: "1.0",
		author: "Helal",
		countDown: 5,
		role: 0,
		description: {
			en: "Check Minecraft server status"
		},
		category: "Utility",
		guide: {
			en: "{pn} <ip> [port]\nExample: {pn} play.hypixel.net 25565"
		}
	},

	langs: {
		en: {
			missingIP: "❌ | Please provide server IP.\nExample: /mc play.hypixel.net",
			checking: "⏳ | Checking server status...",
			offline: "❌ | Server is offline or unreachable.",
			online: "✅ | Server is online!\n🎮 Players: {players}/{max}\n📌 Map: {map}\n⚙️ Version: {version}\n🌍 IP: {ip}:{port}"
		}
	},

	onStart: async function ({ message, args, getLang }) {
		if (!args[0]) return message.reply(getLang("missingIP"));
		const ip = args[0];
		const port = args[1] || 25565;

		await message.reply(getLang("checking"));

		try {
			const state = await Gamedig.query({
				type: "minecraft",
				host: ip,
				port: port
			});

			return message.reply(
				getLang("online")
					.replace("{players}", state.players.length)
					.replace("{max}", state.maxplayers)
					.replace("{map}", state.map || "N/A")
					.replace("{version}", state.raw.vanilla?.version || state.raw.version || "Unknown")
					.replace("{ip}", ip)
					.replace("{port}", port)
			);
		} catch (e) {
			return message.reply(getLang("offline"));
		}
	}
};
