module.exports = {
  config: {
    name: "grouplist",
    version: "1.0",
    author: "Helal",
    countDown: 5,
    role: 2,
    description: "Show all groups where the bot is added",
    category: "Owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, message, event }) {
    const adminUID = "61580156099497"; // শুধু তুমি access করতে পারবে
    if (event.senderID !== adminUID) {
      return message.reply("⛔ You are not allowed to use this command!");
    }

    try {
      // সর্বোচ্চ 100 group list করবে
      const threads = await api.getThreadList(100, null, ["INBOX"]);
      const groups = threads.filter(t => t.isGroup);

      if (groups.length === 0) {
        return message.reply("⚠️ Bot is not in any group.");
      }

      let msg = "📋 Bot is currently in these groups:\n\n";
      let count = 1;
      for (const g of groups) {
        msg += `${count++}. 🏷 ${g.name || "Unnamed Group"}\n🆔 ID: ${g.threadID}\n👥 Members: ${g.participantIDs.length}\n\n`;
      }

      return message.reply(msg);
    } catch (err) {
      return message.reply(`❌ Error: ${err.message}`);
    }
  }
};
