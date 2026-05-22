const router  = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db      = require('../db');
const auth    = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const channels = db.findAll('channels');
  res.json(channels);
});

router.post('/', auth, (req, res) => {
  try {
    const exists = db.findOne('channels', c => c.name === req.body.name);
    if (exists) return res.status(400).json({ message: 'Channel already exists' });

    const channel = {
      _id: uuidv4(),
      name: req.body.name,
      description: req.body.description || '',
      createdAt: new Date().toISOString()
    };
    db.insertOne('channels', channel);
    res.status(201).json(channel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;