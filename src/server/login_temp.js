// server.js (Node.js/Express backend)
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { MongoClient, ObjectId } from 'mongodb';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const app = express();

// Validate environment variables
const { MONGODB_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = process.env;
if (!MONGODB_URI || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SESSION_SECRET) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

// MongoDB connection setup
const client = new MongoClient(MONGODB_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('mydatabase');
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit process on DB connection failure
  }
}

connectDB();

// Use helmet for basic security
app.use(helmet());

// Session setup
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
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
          user = await db.collection('users').insertOne({
            email,
            name: profile.displayName,
            createdAt: new Date(),
          });
          user = user.ops[0]; // Adjust for older MongoDB drivers
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google login routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.redirect('/auth/success');
  }
);

app.get('/auth/success', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    if (!req.user) {
        return res.redirect('/api/user');
    }
    res.json({ message: 'Login successful', user: req.user });
});

app.get('/auth/logout', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Error during logout.");
    }
    res.redirect('/');
  });
});

// Gracefully close MongoDB connection on app termination
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...');
  await client.close();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));