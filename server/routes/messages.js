const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');

router.get('/:channelId', auth, (req, res) => {
  const messages = db.findMany('messages', m => m.channel === req.params.channelId)
    .slice(-50);
  res.json(messages);
});

module.exports = router;