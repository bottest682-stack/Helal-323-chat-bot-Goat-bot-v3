const axios = require("axios");

module.exports = {
  config: {
    name: "dict",
    version: "1.0",
    author: "Helal",
    countDown: 5,
    role: 0,
    description: {
      en: "Get word meaning (English → Bengali)"
    },
    category: "Utility",
    guide: {
      en: ".dict <word>"
    }
  },

  onStart: async function ({ message, args }) {
    if (args.length === 0) {
      return message.reply("📚 Please provide a word.\nExample: .dict hello");
    }

    const word = args.join(" ");
    try {
      const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = res.data[0];

      let phonetic = data.phonetic || "N/A";
      let meaning = data.meanings[0]?.definitions[0]?.definition || "Meaning not found";
      let example = data.meanings[0]?.definitions[0]?.example || "No example available";

      let msg = 
`📖 Dictionary Result
━━━━━━━━━━━━━━
🔤 Word: ${data.word}
🔉 Pronunciation: ${phonetic}

📘 Meaning: ${meaning}
💡 Example: ${example}
━━━━━━━━━━━━━━
🌐 Source: dictionaryapi.dev`;

      message.reply(msg);

    } catch (err) {
      return message.reply("❌ No definition found for this word.");
    }
  }
};
