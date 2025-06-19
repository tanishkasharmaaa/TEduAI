const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { getAIDoubtSolution } = require('../utils/openai');

router.post('/solve', authMiddleware, async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const answer = await getAIDoubtSolution(question);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'AI failed to generate answer' });
  }
});

module.exports = router;
