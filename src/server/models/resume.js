import mongoose from "mongoose"
const { Schema } = mongoose;

const resumeSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  personalInformation: { //contact information
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    address: String,
  
  },
  experience: [ //work experience
    {
      jobTitle: String, //role
      company: String,  //company
      startDate: Date,  //start date
      endDate: Date,    //end date 
      description: String, //responsibilities
    },
  ],
  summary: {  //professional summary
    type: String
  },
  education: [
    {
      degree: String,
      institution: String,
      startDate: Date,
      endDate: Date,
    },
  ],
  skills: [String], 

  feedbacks: [{
    reviewer: { type: String},
    comment: { type: String},
    date: { type: Date, default: Date.now}
  }],
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

export default Resume;
