module.exports = {
  config: {
    name: "groups",
    version: "1.0",
    author: "Helal",
    countDown: 5,
    role: 2,
    description: "Show all groups where bot is added",
    category: "Owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    const adminUID = "61580156099497";
    if (event.senderID !== adminUID) {
      return message.reply("⛔ You don’t have permission to use this command!");
    }

    try {
      const threads = await api.getThreadList(100, null, ["INBOX"]);
      const groupThreads = threads.filter(t => t.isGroup);

      if (groupThreads.length === 0) {
        return message.reply("🤖 Bot is not in any groups.");
      }

      let msg = "📋 Groups where bot is added:\n\n";
      groupThreads.forEach((t, i) => {
        msg += `${i + 1}. ${t.name || "Unnamed Group"}\n🆔 ID: ${t.threadID}\n\n`;
      });

      return message.reply(msg);
    } catch (err) {
      return message.reply(`⚠️ Error: ${err.message}`);
    }
  }
};
