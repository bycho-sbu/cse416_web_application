import express from "express";
import cors from "cors";
import Resume from './models/resume.js';
import User from './models/user.js';
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

//resume: fetching a resume by userId
app.get('/resume/:userId', async (req, res) => {

  let userId = new mongoose.Types.ObjectId(req.params.userId);
  try {
    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(200).json(null); // user doesnt have a resume
    }
    res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    const { resumeId, userId, comment } = req.body;
    //TODO userid session
    console.log(req.body);
    try {
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).send('Resume not found');
      }
      // TODO SESSION reviewer.username
      
      resume.feedbacks.push({
        reviewer: userId,   // TODO link with reviwer(current session id's name)
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
app.post("/saveResume", async (req, res) => {
  const { firstName, lastName, email, phone, location, summary, education, experience, skills } = req.body;
  
  const userId = new mongoose.Types.ObjectId("9d2fe16262bd69b7ccf4f984"); // TODO
  try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      let existingResume = await Resume.findOne({ userId });
      
      // update
      if (existingResume) {
      console.log("in update");  
      existingResume.personalInformation.firstname = firstName;
      existingResume.personalInformation.lastname = lastName;
      existingResume.personalInformation.email = email;
      existingResume.personalInformation.phone = phone;
      existingResume.personalInformation.address = location;
      existingResume.summary = summary;
      existingResume.experience = experience;
      existingResume.education = education;
      existingResume.skills = skills;

      await existingResume.save()
      res.status(200).json(existingResume);  
    } else {
      console.log("in insert");  
      // insert
      const newResume = new Resume({
        userId,
        personalInformation: { 
          firstname: firstName,
          lastname: lastName,
          email,
          phone,
          address: location, 
        },
        summary,
        experience,
        education,
        skills
      });

      await newResume.save();

      res.status(201).json(newResume); 
    }

  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).send("Server error");
  }
});
