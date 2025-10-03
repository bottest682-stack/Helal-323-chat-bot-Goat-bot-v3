const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const ADMIN_UID = "61580156099497"; // শুধু এই UID ফাইল আপলোড করতে পারবে

module.exports = {
  config: {
    name: "fileupload",
    version: "1.1",
    author: "Helal",
    countDown: 5,
    role: 2,
    description: {
      en: "Upload file into bot's commands folder"
    },
    category: "Owner",
    guide: {
      en: "{pn} + attach any file"
    }
  },

  onStart: async function ({ message, event }) {
    try {
      // Permission check
      if (String(event.senderID) !== ADMIN_UID) {
        return message.reply("⛔ You don’t have permission to use this command.");
      }

      if (!event.attachments || event.attachments.length === 0) {
        return message.reply("⚠️ Please attach a file to upload.");
      }

      for (const attachment of event.attachments) {
        const fileUrl = attachment.url;
        const fileName = attachment.name || `file_${Date.now()}.js`;

        const savePath = path.join(__dirname, fileName);

        const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(savePath, response.data);

        message.reply(`✅ File uploaded successfully!\n📂 Saved in commands folder as: ${fileName}`);
      }
    } catch (err) {
      console.error(err);
      message.reply("❌ Error while uploading file.");
    }
  }
};
