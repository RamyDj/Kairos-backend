const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  firstname: String,
  email: { type: String, unique: true },
  password: String,
  skills: [String],
  last_connection: Date,
  searches: [{type: mongoose.Schema.Types.ObjectId, ref: 'searches'}],
  verified: Boolean,
});

const User = mongoose.model('users', userSchema);

module.exports = User;