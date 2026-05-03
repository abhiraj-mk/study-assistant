const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  res.json({ success: true, data: { _id: req.params.id } });
});

router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});

router.delete('/:id', (req, res) => {
  res.json({ success: true });
});

module.exports = router;