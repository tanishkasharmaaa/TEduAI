const express = require("express");
const router = express.Router();
const { getAIDoubtSolution } = require("../utils/openai");
const { verifyToken } = require("../middleware/authMiddleware");
const StudentChat = require('../models/StudentChat');

// 🔹 POST /api/doubt/solve - Ask a question to AI
router.post('/solve', verifyToken, async (req, res) => {
  try {
    const { question } = req.body;

    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'A valid question is required' });
    }

    const cleanQuestion = question.trim();
    console.log("🔹 Question:", cleanQuestion);
    console.log("🔹 User ID:", userId);

    // 🔮 Get AI answer
    let answer = '';
    try {
      answer = await getAIDoubtSolution(cleanQuestion);
    } catch (err) {
      console.error("❌ OpenAI Error:", err.message);
      answer = "I'm sorry, I'm currently unable to answer that. Please try again later.";
    }

    // 💾 Save to chat
    let chat = await StudentChat.findOne({ user: userId });
    if (!chat) {
      chat = new StudentChat({ user: userId, messages: [] });
    }

    chat.messages.push({ sender: 'user', text: cleanQuestion, timestamp: new Date() });
    chat.messages.push({ sender: 'ai', text: answer, timestamp: new Date() });

    await chat.save();

    res.status(200).json({ answer });
  } catch (err) {
    console.error("❌ AI Route Error:", err.message);
    res.status(500).json({ error: 'AI failed to generate answer' });
  }
});

// 🔹 GET /api/doubt/history - Get student's chat history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const chat = await StudentChat.findOne({ user: userId }).lean();
    res.status(200).json(chat?.messages || []);
  } catch (err) {
    console.error("❌ History Error:", err.message);
    res.status(500).json({ error: 'Could not fetch chat history' });
  }
});

module.exports = router;

