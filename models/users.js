const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  firstname: String,
  email: { type: String, unique: true },
  password: String,
  token:String,
  skills: [{
    legalScore: { type: Number, default: 0 }, 
    commerceScore: { type: Number, default: 0 } 
  }],
  last_connection: Date,
  searches: [{type: mongoose.Schema.Types.ObjectId, ref: 'searches'}],
  verified: Boolean,
});

const User = mongoose.model('users', userSchema);

module.exports = User;