const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "fm",
    version: "1.1",
    author: "Helal",
    countDown: 10,
    role: 0,
    description: "Create a framed collage of group members (only avatars, no names)",
    category: "Fun",
    guide: {
      en: ".fm -> show group member avatars (max 12)"
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const participantIDs = threadInfo.participantIDs || [];

      if (!participantIDs || participantIDs.length === 0) {
        return message.reply("⚠️ No members found in this group.");
      }

      const MAX_MEMBERS = 12;
      const members = participantIDs.slice(0, MAX_MEMBERS);

      const N = members.length;
      const cols = N <= 4 ? N : (N <= 6 ? 3 : 4);
      const rows = Math.ceil(N / cols);
      const cellSize = 220;
      const padding = 20;

      const width = cols * cellSize + (cols + 1) * padding;
      const height = rows * cellSize + (rows + 1) * padding + 80;

      const image = new Jimp(width, height, 0xffffffff);

      const font20 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      const title = threadInfo.threadName || "Group Members";
      const titleWidth = Jimp.measureText(font20, title);
      image.print(font20, Math.floor((width - titleWidth) / 2), 16, title);

      const tmpDir = path.join(__dirname, "tmp_fm");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

      for (let i = 0; i < N; i++) {
        const id = members[i];
        const row = Math.floor(i / cols);
        const col = i % cols;

        const x = padding + col * (cellSize + padding);
        const y = 60 + padding + row * (cellSize + padding);

        let avatarBuffer = null;
        try {
          const url = `https://graph.facebook.com/${id}/picture?type=large`;
          const res = await axios.get(url, { responseType: "arraybuffer", timeout: 8000 });
          avatarBuffer = Buffer.from(res.data, "binary");
        } catch (e) {
          avatarBuffer = null;
        }

        let avatar;
        if (avatarBuffer) {
          try {
            avatar = await Jimp.read(avatarBuffer);
          } catch {
            avatar = new Jimp(cellSize, cellSize, 0xffcfcfcf);
          }
        } else {
          avatar = new Jimp(cellSize, cellSize, 0xffcfcfcf);
        }

        avatar.cover(cellSize, cellSize);

        // round mask
        const radius = Math.floor(cellSize / 2);
        const circle = new Jimp(cellSize, cellSize, 0x00000000);
        circle.scan(0, 0, circle.bitmap.width, circle.bitmap.height, function (px, py, idx) {
          const dx = px - cellSize / 2;
          const dy = py - cellSize / 2;
          if (dx * dx + dy * dy <= radius * radius) {
            circle.bitmap.data[idx + 0] = 255;
            circle.bitmap.data[idx + 1] = 255;
            circle.bitmap.data[idx + 2] = 255;
            circle.bitmap.data[idx + 3] = 255;
          } else {
            circle.bitmap.data[idx + 3] = 0;
          }
        });

        avatar.mask(circle, 0, 0);

        // border
        const border = new Jimp(cellSize + 8, cellSize + 8, 0x00000000);
        border.scan(0, 0, border.bitmap.width, border.bitmap.height, function (px, py, idx) {
          const cx = border.bitmap.width / 2;
          const cy = border.bitmap.height / 2;
          const dx = px - cx;
          const dy = py - cy;
          const r2 = Math.pow(cellSize / 2 + 4, 2);
          if (dx * dx + dy * dy <= r2) {
            border.bitmap.data[idx + 0] = 230;
            border.bitmap.data[idx + 1] = 230;
            border.bitmap.data[idx + 2] = 230;
            border.bitmap.data[idx + 3] = 255;
          } else {
            border.bitmap.data[idx + 3] = 0;
          }
        });

        const bx = x - 4;
        const by = y - 4;
        image.composite(border, bx, by);
        image.composite(avatar, x, y);
      }

      const outPath = path.join(tmpDir, `group_${event.threadID}_${Date.now()}.jpg`);
      await image.quality(80).writeAsync(outPath);

      await api.sendMessage(
        { body: `📸 Group Members Frame (showing ${members.length} avatars)`, attachment: fs.createReadStream(outPath) },
        event.threadID,
        event.messageID
      );

      setTimeout(() => {
        try {
          fs.unlinkSync(outPath);
        } catch {}
      }, 30000);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Error while creating the frame.");
    }
  }
};
