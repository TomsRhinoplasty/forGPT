// models/Map.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const mapSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name:  { type: String, required: true },

    // store ANY nested structure exactly as sent
    data:  { type: Schema.Types.Mixed, required: true },

    createdAt: { type: Date, default: Date.now }
  },
  {
    minimize: false           // <-- keep empty objects/arrays
  }
);

// faster look‑ups per user
mapSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Map', mapSchema);
