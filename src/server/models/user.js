const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resumes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume', 
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
