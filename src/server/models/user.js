import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  resumes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume', 
    },
  ],
  createdAt: {}
});

const User = mongoose.model('User', userSchema);