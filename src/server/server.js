// server.js
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { MongoClient, ObjectId } from 'mongodb';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import bcrypt from 'bcrypt';
import Groq from 'groq-sdk';

import * as Resume from './models/resume.js';
import * as User from './models/user.js';

dotenv.config();

const app = express();

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Uncomment line 237 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// Middleware to parse JSON and URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the cors middleware with proper configuration
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    credentials: true, // Allow cookies and other credentials
    optionsSuccessStatus: 200,
  })
);

// Validate environment variables
const { MONGODB_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = process.env;
if (!MONGODB_URI || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SESSION_SECRET) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

// MongoDB connection setup
mongoose.connect(MONGODB_URI);
let db = mongoose.connection;

// AI setup
const groq = new Groq({ apiKey: process.env.GROQ_APIKEY });

// Start the server after connecting to the database
async function startServer() {
    try {
        // db = client.db('CSE416-Project'); // Replace with your database name
        // console.log('Connected to MongoDB');

        db.on("error", console.error.bind(console, "MongoDB connection error:"));
        db.on("connected", () => {
            console.log("Connected to database");
        });

        // Session setup
        app.use(
            session({
                secret: SESSION_SECRET,
                resave: false,
                saveUninitialized: true,
                cookie: {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax', // Adjust as needed
                },
            })
        );

        // Passport setup
        app.use(passport.initialize());
        app.use(passport.session());

        // Google OAuth strategy
        passport.use(
            new GoogleStrategy(
                {
                    clientID: GOOGLE_CLIENT_ID,
                    clientSecret: GOOGLE_CLIENT_SECRET,
                    callbackURL: '/auth/google/callback',
                },
                async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;
                    let user = await db.collection('users').findOne({ email });

                    if (!user) {
                    const newUser = {
                        email,
                        name: profile.displayName,
                        googleId: profile.id,
                        createdAt: new Date(),
                    };
                    const result = await db.collection('users').insertOne(newUser);
                    newUser._id = result.insertedId;
                    user = newUser;
                    }

                    return done(null, user);
                    } catch (err) {
                        return done(err, null);
                    }
                }
            )
        );

        // Serialize and deserialize user
        passport.serializeUser((user, done) => {
            done(null, user._id.toString());
        });

        passport.deserializeUser(async (id, done) => {
            try {
                const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        });

        // Google login route
        app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

        // Google OAuth callback route
        app.get(
            '/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/login' }),
            (req, res) => {
                // Successful authentication, redirect to the frontend
                res.redirect('http://localhost:5173'); // Replace with your frontend URL
            }
        );

        // Login route
        app.post('/api/auth/login', async (req, res) => {
            const { email, password } = req.body;
        
            try {
                const user = await db.collection('users').findOne({ email });
            
                if (!user) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
            
                // Compare hashed passwords
                const match = await bcrypt.compare(password, user.password);
            
                if (!match) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
            
                // Log the user in by creating a session
                req.login(user, (err) => {
                    if (err) {
                    return res.status(500).json({ error: 'Login failed' });
                    }
                    res.json({ message: 'Logged in successfully', user });
                });
            } catch (err) {
                console.error('Login Error:', err);
                res.status(500).json({ error: 'An error occurred during login' });
            }
        });

        // Logout route
        app.get('/api/auth/logout', (req, res, next) => {
            req.logout(function (err) {
                if (err) {
                    console.error('Logout Error:', err);
                    return next(err);
                }
                res.json({ message: 'Logged out successfully' });
            });
        });

        // Signup route
        app.post('/api/auth/signup', async (req, res) => {
            const { email, password } = req.body;
        
            try {
                const existingUser = await db.collection('users').findOne({ email });
            
                if (existingUser) {
                    return res.status(409).json({ error: 'Email already in use' });
                }
            
                // Hash the password before storing it
                const hashedPassword = await bcrypt.hash(password, 10);
            
                const newUser = {
                    email,
                    name: email.slice(0, email.indexOf("@")),
                    password: hashedPassword,
                    createdAt: new Date(),
                };
            
                const result = await db.collection('users').insertOne(newUser);
                newUser._id = result.insertedId;
            
                // Optionally log the user in after signup
                req.login(newUser, (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Signup failed' });
                    }
                    res.json({ message: 'Signup successful', user: newUser });
                });
            } catch (err) {
                console.error('Signup Error:', err);
                res.status(500).json({ error: 'An error occurred during signup' });
            }
        });

        // Route to get user info
        app.get('/api/user', (req, res) => {
            if (req.isAuthenticated()) {
                res.json({ user: req.user });
            } else {
                res.status(401).json({ error: 'Unauthorized' });
            }
        });

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

            // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ to be uncommented @@@@@@@@@@@@@@@@@@@@@@@@@@@@
            // const resume = await Resume.findOne({ userId });
            // if (!resume) {
            // return res.status(200).json(null); // user doesnt have a resume
            // }
            // res.status(200).json(resume);
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
        app.post("/generateSummary", async (req, res) => {
            
            try {
                // Default
                var content = "With following information, please provide professional and descriptive summary for resume: " + JSON.stringify(req.body);
                // console.log(content);
                const completion = await groq.chat.completions
                    .create({
                    messages: [
                        {
                            role: "system",
                            content: content,
                        },
                    ],
                        model: "llama3-8b-8192",
                    })
                    .then((chatCompletion) => {
                        // console.log(chatCompletion.choices[0]?.message?.content || "No results");
                        res.send(chatCompletion.choices[0]?.message?.content || "No results");
                    });
                // console.log(completion);
            } catch(err) {
                console.error(err);
                res.status(500).send("Server error");
            }
        })
        
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

            console.log(req.body);
            
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

        // Start the server after DB connection is established
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process on DB connection failure
    }
}

startServer();

// Gracefully close MongoDB connection on app termination
process.on('SIGINT', async () => {
    console.log('\nClosing MongoDB connection...');
    db.close();
    process.exit(0);
});