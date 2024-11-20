import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReplySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, 
  });
  

const feedbackSchema = new Schema({
  // feedback owner
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  // resume owner
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume', 
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [ReplySchema],
});

// Create Mongoose model
const Feedback = mongoose.model('Feedback', feedbackSchema);