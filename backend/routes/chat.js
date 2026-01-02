const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @route   GET api/chat/history
// @desc    Get all chat messages
// @access  Public (or Private if we add auth middleware)
router.get('/history', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
