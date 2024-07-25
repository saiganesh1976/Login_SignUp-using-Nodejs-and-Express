const express = require("express");
const mongoose = require("mongoose");
const User = require("./databaseSchema");

const app = express();
app.use(express.static("public"));
app.use(express.json()); // Middleware

// middleware:
/*
    const middleware = (req, res, next) => {
      console.log("hello from middleware");
      //next();
    };
w
    middleware();

    app.get("./about", middleware, (req, res) => {
      console.log("hello from about page");
    });
*/
mongoose.connect("mongodb://localhost:27017/UserDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "error"));
db.once("open", () => {
  console.log("Database connected successfully");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.post("/Signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

app.post("/Login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ message: "User found" });
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
