const mongoose = require('mongoose');
const { Schema } = mongoose;

const resumeSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  personalInformation: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
  
  },
  experience: [
    {
      jobTitle: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  education: [
    {
      degree: String,
      institution: String,
      graduationYear: Number,
      description: String,
    },
  ],
  skills: [String], 
  certifications: [String], 
  feedbacks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback', 
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
