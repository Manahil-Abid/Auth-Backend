// backend/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const Item = require('../models/item'); // Capital I
const auth = require('../middleware/authMiddleware');

// Create item
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const item = await Item.create({ user: req.user._id, title, description });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Read all items for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });

    item.title = req.body.title ?? item.title;
    item.description = req.body.description ?? item.description;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });

    await item.deleteOne(); // Updated method
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
