const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { getAIDoubtSolution } = require('../utils/openai');
const StudentChat = require('../models/StudentChat');

router.post('/solve', authMiddleware, async (req, res) => {
  const { question } = req.body;
  const userId = req.user.id;

  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    const answer = await getAIDoubtSolution(question);

    let chat = await StudentChat.findOne({ user: userId });
    if (!chat) chat = new StudentChat({ user: userId, messages: [] });

    chat.messages.push({ sender: 'user', text: question });
    chat.messages.push({ sender: 'ai', text: answer });

    await chat.save();

    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'AI failed to generate answer' });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const chat = await StudentChat.findOne({ user: req.user.id });
    res.json(chat?.messages || []);
  } catch {
    res.status(500).json({ error: 'Could not fetch chat history' });
  }
});


module.exports = router;
