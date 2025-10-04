const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "fm",
    version: "1.0",
    author: "Helal",
    countDown: 10,
    role: 0,
    description: "Collage of all group members' profile pictures",
    category: "Group",
    guide: { en: ".fm" }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const info = await api.getThreadInfo(event.threadID);
      if (!info || !info.participantIDs) {
        return message.reply("⚠️ Couldn’t get group members.");
      }

      const members = info.participantIDs;
      if (members.length === 0) return message.reply("⚠️ No members found.");

      message.reply(`📸 Making collage of ${members.length} members...`);

      const imgSize = 120; // প্রতি ছবি সাইজ
      const perRow = 6; // প্রতি row এ কয়টা ছবি
      const rows = Math.ceil(members.length / perRow);

      const canvas = createCanvas(imgSize * perRow, imgSize * rows);
      const ctx = canvas.getContext("2d");

      for (let i = 0; i < members.length; i++) {
        try {
          const id = members[i];
          const url = `https://graph.facebook.com/${id}/picture?width=${imgSize}&height=${imgSize}&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

          const res = await axios.get(url, { responseType: "arraybuffer" });
          const img = await loadImage(Buffer.from(res.data, "binary"));

          const x = (i % perRow) * imgSize;
          const y = Math.floor(i / perRow) * imgSize;
          ctx.drawImage(img, x, y, imgSize, imgSize);
        } catch (err) {
          console.log("⚠️ Error fetching profile:", err.message);
        }
      }

      const out = path.join(__dirname, "collage.jpg");
      fs.writeFileSync(out, canvas.toBuffer("image/jpeg"));
      await api.sendMessage({ attachment: fs.createReadStream(out) }, event.threadID);
      fs.unlinkSync(out);
    } catch (e) {
      console.error(e);
      message.reply("❌ Error creating collage.");
    }
  }
};
