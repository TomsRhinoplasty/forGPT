// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  }
});

// Pre-save hook: Automatically hash the password before saving the user document
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();
  try {
    // Generate a salt with 10 rounds of processing
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare candidate password during login with the stored hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model, based on the userSchema
module.exports = mongoose.model('User', userSchema);
