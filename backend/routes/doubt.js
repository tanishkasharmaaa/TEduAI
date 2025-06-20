const express = require("express");
const router = express.Router();
const { getAIDoubtSolution } = require("../utils/openai");
const { verifyToken } = require("../middleware/authMiddleware");

const StudentChat = require('../models/StudentChat');

// 🔹 POST /api/doubt/solve - Ask a question to AI
router.post('/solve', verifyToken, async (req, res) => {
  try {
    const { question } = req.body;

    if (!req.user || !req.user.id) {
      console.error("❌ req.user is undefined or missing id");
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    const userId = req.user.id;

    // 🔒 Validate input
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ error: 'Valid question is required' });
    }

    console.log("🔹 Question received:", question);
    console.log("🔹 User ID:", userId);

    // 🔮 Get answer from AI
    const answer = await getAIDoubtSolution(question);
    console.log("🔹 AI Answer:", answer);

    // 💾 Save chat to database
    let chat = await StudentChat.findOne({ user: userId });
    if (!chat) {
      chat = new StudentChat({ user: userId, messages: [] });
    }

    chat.messages.push({ sender: 'user', text: question });
    chat.messages.push({ sender: 'ai', text: answer });

    await chat.save();

    res.status(200).json({ answer });
  } catch (err) {
    console.error("❌ AI Error:", err.message);
    console.error(err.stack); // full trace
    res.status(500).json({ error: 'AI failed to generate answer' });
  }
});

// 🔹 GET /api/doubt/history - Get student's chat history
router.get('/history', verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const chat = await StudentChat.findOne({ user: req.user.id }).lean();
    res.status(200).json(chat?.messages || []);
  } catch (err) {
    console.error("❌ History Error:", err.message);
    res.status(500).json({ error: 'Could not fetch chat history' });
  }
});

module.exports = router;
