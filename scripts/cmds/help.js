const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    version: "3.1",
    author: "Helal",
    countDown: 5,
    role: 0,
    description: "Show stylish help menu with all commands ⚡",
    category: "System",
    guide: {
      en: ".help অথবা .help <command name>"
    }
  },

  onStart: async function ({ message, args }) {
    const commandsPath = __dirname;
    const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));
    const prefix = "."; // তোমার prefix এখানে ফিক্সড

    // যদি শুধু .help লেখা হয়
    if (!args[0]) {
      let categories = {};

      for (let file of commandFiles) {
        try {
          const cmd = require(path.join(commandsPath, file));
          if (cmd.config && cmd.config.name) {
            let cat = cmd.config.category || "Misc";
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(`⚡ ${prefix}${cmd.config.name} › ${cmd.config.description || "No description"}`);
          }
        } catch (e) {}
      }

      let msg = `┏━━━━━━━━━━━━━━┓
🌐 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 🌐
┗━━━━━━━━━━━━━━┛

💠 Prefix: ${prefix}
📦 Total Commands: ${commandFiles.length}

`;

      for (let cat in categories) {
        msg += `🔹 ${cat.toUpperCase()} 🔹\n${categories[cat].join("\n")}\n━━━━━━━━━━━━━━━\n`;
      }

      msg += `💡 Usage: ${prefix}help <command name>`;

      return message.reply(msg);
    }

    // যদি .help <command> ব্যবহার করা হয়
    let cmdName = args[0].toLowerCase();
    const file = commandFiles.find(f => f.replace(".js", "").toLowerCase() === cmdName);
    if (!file) return message.reply(`❌ Command '${cmdName}' পাওয়া যায়নি!`);

    const cmd = require(path.join(commandsPath, file));
    let details =
`┏━━━━━━━━━━━━━━┓
 🔎 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢
┗━━━━━━━━━━━━━━┛

📌 Command: ${prefix}${cmd.config.name}
📂 Category: ${cmd.config.category || "Unknown"}
👤 Author: ${cmd.config.author || "Unknown"}
ℹ️ Description: ${cmd.config.description || "No description"}
⚡ Cooldown: ${cmd.config.countDown || 0}s
📝 Guide: ${cmd.config.guide?.en || "No guide"}
`;

    return message.reply(details);
  }
};
