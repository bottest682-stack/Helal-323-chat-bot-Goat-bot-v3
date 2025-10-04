const axios = require("axios");

module.exports = {
  config: {
    name: "dict",
    version: "1.1",
    author: "Helal",
    countDown: 5,
    role: 0,
    description: "Get English → Bengali meaning",
    category: "Utility",
    guide: {
      en: "{pn} <word>"
    }
  },

  onStart: async function ({ message, args }) {
    if (args.length === 0) {
      return message.reply("🔍 Please provide an English word.\nExample: .dict love");
    }
    const word = args[0].toLowerCase();

    try {
      // প্রথমে বাংলা অনুবাদ API চেষ্টা
      const translRes = await axios.get(`https://api.mymemory.translated.net/get?q=${word}&langpair=en|bn`);
      const bnTranslation = translRes.data.responseData.translatedText;

      // ইংরেজি dictionary API
      const dictRes = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const dictData = dictRes.data[0];
      const meaning = dictData.meanings[0]?.definitions[0]?.definition || "Definition not found";

      let msg =
`📖 Dictionary Result
━━━━━━━━━━━━
🔤 Word: ${dictData.word}
🔉 Pronunciation: ${dictData.phonetic || "N/A"}

📘 English Meaning: ${meaning}
🈂️ Bangla Meaning: ${bnTranslation}
━━━━━━━━━━━━
💡 Example: ${dictData.meanings[0]?.definitions[0]?.example || "No example"}  
🌐 Source: dictionaryapi.dev / MyMemory`;

      return message.reply(msg);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Meaning not found.");
    }
  }
};
