import express from "express";

const app = express();
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.listen(2525);
console.log("Server listening on port 2525...");

// let mongoose = require("mongoose");
// let mongoDB = "mongodb://127.0.0.1:27017/cse416";
// mongoose.connect(mongoDB);

// let db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.on("connected", () => {
//     console.log("Connected to database");
// });
// for later: db connect and cross server 
// for cross server request
// const corsOptions = {
//     origin: "http://localhost:3000",
//     optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));