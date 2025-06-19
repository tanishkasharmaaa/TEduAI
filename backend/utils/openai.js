const OpenAI = require('openai');
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getAIDoubtSolution = async (question) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful educational assistant for students.' },
      { role: 'user', content: question },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { getAIDoubtSolution };

