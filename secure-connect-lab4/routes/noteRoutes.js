const express = require('express');
const Note = require('../models/Note');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const appEvents = require('../events/appEvents');

const router = express.Router();

// GET /api/notes - Fetch logged-in user's notes (Protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user.id }).sort({ createdAt: 1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
});

// GET /api/notes/all - Admin-only RBAC route to view all platform notes
router.get('/all', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const allNotes = await Note.find().populate('owner', 'username email');
    res.status(200).json(allNotes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all notes', error: error.message });
  }
});

// POST /api/notes - Create a new note (Protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = await Note.create({
      title,
      content,
      owner: req.user.id
    });

    appEvents.emit('note:created', note);

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
});

// PUT /api/notes/:id - Update own note (Protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { title: req.body.title, content: req.body.content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
});

// DELETE /api/notes/:id - Delete own note (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
});

module.exports = router; 