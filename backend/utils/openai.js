const { Configuration, OpenAIApi } = require('openai');
require("dotenv").config()

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const getAIDoubtSolution = async (question) => {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo', 
    messages: [
      { role: 'system', content: 'You are a helpful educational assistant for students.' },
      { role: 'user', content: question },
    ],
  });

  return response.data.choices[0].message.content;
};

module.exports = { getAIDoubtSolution };
