const api = require("api"); // তোমার bot API require করা আছে ধরে নিচ্ছি

module.exports = {
  config: {
    name: "groups",
    version: "1.1",
    author: "Helal",
    countDown: 5,
    role: 2, // Owner/admin only
    description: "Show which groups the bot is added to",
    category: "Owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, event }) {
    const adminUID = "61580156099497"; // Bot admin UID
    if (event.senderID !== adminUID) {
      return message.reply("⛔ Only bot admin can use this command!");
    }

    try {
      // Fetch all threads
      const allThreads = await api.getThreadList(100, null, ["INBOX", "GROUP"]);

      // Filter only group threads
      const groups = allThreads.filter(thread => thread.isGroup).map(g => g.name || g.threadID);

      if (!groups.length) {
        return message.reply("❌ Bot is not added to any group.");
      }

      const groupList = groups.join("\n• ");
      return message.reply("📋 Bot is in the following groups:\n• " + groupList);

    } catch (err) {
      console.error("Group list error:", err);
      return message.reply("⚠️ Error: " + err.message);
    }
  }
};
