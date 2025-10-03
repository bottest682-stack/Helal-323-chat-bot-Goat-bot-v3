const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "filedelete",
    version: "1.0",
    author: "Helal",
    countDown: 5,
    role: 2,
    description: "Delete a command file from bot",
    category: "Owner",
    guide: {
      en: "{pn} filename.js"
    }
  },

  onStart: async function ({ message, event, args }) {
    const adminUID = "61580156099497";
    if (event.senderID !== adminUID) {
      return message.reply("⛔ You are not allowed to delete files!");
    }

    if (args.length === 0) {
      return message.reply("⚠️ Please provide a filename.\nExample: .filedelete quiz.js");
    }

    const fileName = args[0];
    const filePath = path.join(__dirname, fileName);

    if (!fs.existsSync(filePath)) {
      return message.reply(`❌ File not found: ${fileName}`);
    }

    try {
      fs.unlinkSync(filePath);
      return message.reply(`✅ File deleted: ${fileName}`);
    } catch (err) {
      return message.reply(`⚠️ Error deleting file: ${err.message}`);
    }
  }
};
