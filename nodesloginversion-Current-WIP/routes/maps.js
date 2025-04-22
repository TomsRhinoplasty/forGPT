// routes/maps.js
const express = require('express');
const router  = express.Router();
const Map     = require('../models/Map');
const jwt     = require('jsonwebtoken');

/* ── auth middleware ─────────────────────────────────────────── */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  if (!token)   return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;                // { userId: ... }
    next();
  });
}

/* ── POST /api/maps  →  create ───────────────────────────────── */
router.post('/', authenticateToken, async (req, res) => {
  const { name, data } = req.body;
  if (!name || !data)
    return res.status(400).json({ error: 'Map name and data are required.' });

  try {
    const map = await Map.create({ owner: req.user.userId, name, data });
    res.status(201).json({ map: map.toObject({ flattenMaps: true }) });
  } catch (err) {
    res.status(500).json({ error: 'Error saving map.', details: err.message });
  }
});

/* ── GET /api/maps   →  list user’s maps ─────────────────────── */
router.get('/', authenticateToken, async (req, res) => {
  try {
    // .lean() ⇒ plain JSON; no Mongoose prototype baggage
    const maps = await Map.find({ owner: req.user.userId }).lean();
    res.json(maps);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching maps.', details: err.message });
  }
});

/* ── PUT /api/maps/:id  →  update ─────────────────────────────── */
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, data } = req.body;
  if (!data)
    return res.status(400).json({ error: 'Map data is required.' });

  try {
    const map = await Map.findOneAndUpdate(
      { _id: id, owner: req.user.userId },
      { name, data },
      { new: true, runValidators: true }
    ).lean();

    if (!map) return res.status(404).json({ error: 'Map not found or unauthorized.' });
    res.json({ map });
  } catch (err) {
    res.status(500).json({ error: 'Error updating map.', details: err.message });
  }
});

/* ── DELETE /api/maps/:id  →  remove ─────────────────────────── */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Map.findOneAndDelete({
      _id: req.params.id, owner: req.user.userId
    });
    if (!deleted) return res.status(404).json({ error: 'Map not found or unauthorized.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting map.', details: err.message });
  }
});

module.exports = router;
