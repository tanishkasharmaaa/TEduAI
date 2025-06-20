const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getAIDoubtSolution = async (question) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: question }],
    model: "gpt-3.5-turbo",
  });

  return chatCompletion.choices[0].message.content.trim();
};

module.exports = { getAIDoubtSolution };
