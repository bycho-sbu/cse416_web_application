import express from "express";

const app = express();
app.use(express.urlencoded({extended : true}));
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "416_project"
});



db.connect((err) => {
    if(err) throw err;
    console.log("Connected!");
})

app.listen(2424);
console.log("Server listening on port 2424...");