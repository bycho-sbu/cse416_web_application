import express from "express";
import cors from "cors";
import Resume from './models/resume.js';
import User from './models/user.js';
import Feedback from './models/feedback.js';
import mongoose from "mongoose"

const app = express();
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.listen(2525);
console.log("Server listening on port 2525...");

let mongoDB = "mongodb://127.0.0.1:27017/cse416";
mongoose.connect(mongoDB);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("connected", () => {
    console.log("Connected to database");
});

// cross origin request for diff domain
const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


//------------------GET------------------------
// feedboard: fetch all resumes
app.get("/resumes", async (req, res) => {
    try {
      const resumes = await Resume.find(); 
      res.status(200).json(resumes);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      res.status(500).send("Server error");
    }
  });

  // fetch feedbacks for the resume
app.get("/feedbacks/:resumeId", async (req, res) => {
    const resumeId = req.params.resumeId;

    try {
        const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).send('Resume not found');
      }
      res.json(resume.feedbacks);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

// ---------------POST-------------------------
// Route to submit feedback for a resume
app.post("/feedbacks", async (req, res) => {
    const { resumeId, reviewerId, comment } = req.body;
  
    try {
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).send('Resume not found');
      }
      const reviwerName = await User.findById(reviewerId);
      resume.feedbacks.push({
        reviwerName, // TODO link with reviwer(current session id's name)
        comment,
        date: new Date(), 
      });
  
      await resume.save();
      res.json(resume.feedbacks); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
  // Route to save resume
app.post("/resumes", async (req, res) => {
  const { firstName, lastName, email, phone, location, summary, education, experience, skills, userId } = req.body;
  
  
  try {
      const newResume = new Resume({
          userId,  // TODO
          firstName,
          lastName,
          email,
          phone,
          location,
          summary,
          education,
          experience,
          skills
      });

      await newResume.save();

      res.status(201).json(newResume);  
  } catch (error) {
      console.error("Error saving resume:", error);
      res.status(500).send("Server error");
  }
});
