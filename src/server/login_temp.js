// server.js (Node.js/Express backend)
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { MongoClient } = require('mongodb');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();

// MongoDB connection setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('mydatabase');
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectDB();

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await db.collection('users').findOne({ email });

    if (!user) {
      user = await db.collection('users').insertOne({ email, name: profile.displayName, createdAt: new Date() });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.collection('users').findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google login routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/auth/success');
});

app.get('/auth/success', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.json({ message: 'Login successful', user: req.user });
});

app.get('/auth/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));