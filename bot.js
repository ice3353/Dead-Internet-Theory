const { Client } = require('discord.js-selfbot-v13');
const axios = require('axios');
const client = new Client();
const Token = 'Token Here';
const Gemini = 'Gemini API Key Here';

async function getGeminiResponse(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const data = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };
  try {
    const response = await axios.post(url, data);
    const candidates = response.data.candidates;
    if (candidates && candidates.length > 0) {
      return candidates[0].content.parts[0].text;
    }
    return null;
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    return null;
  }
}

client.on('ready', async () => {
  console.log(`[✅] Logged in as ${client.user.username} (ID :${client.user.id})`);
})

client.on('messageCreate', async (message) => {
  if (message.author.id === client.user.id) return;
  else if (message.channel.type === 'DM' || message.content.includes(`<@${client.user.id}>`)) {
    let response = await getGeminiResponse(`Respond like a friendly Discord user: ${message.content.replace(`<@${client.user.id}>`, '').trim()}`, Gemini);
    if (response) {
      message.reply(response);
    }
  }
})

client.login(Token);
