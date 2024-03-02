// server.js

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2"); // Import mysql2 instead of mysql

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "APP",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected");
});

// Routes
app.get("/home", (req, res) => {
  res.sendFile(
    __dirname +
      "/Users/sutipatel/Downloads/CASHCLOUD/node-authentication/public/home.html"
  );
});

app.get("/login", (req, res) => {
  res.sendFile(
    __dirname +
      "/Users/sutipatel/Downloads/CASHCLOUD/node-authentication/public/login.html/login.html"
  );
});

app.get("/register", (req, res) => {
  res.sendFile(
    __dirname +
      "/public//Users/sutipatel/Downloads/CASHCLOUD/node-authentication/public/register.html.html"
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length === 0) {
        return res.status(400).send("User not found");
      }

      const user = results[0];

      // Check password
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send("Invalid password");
      }

      res.send("Login successful!");
    }
  );
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert new user into database
  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log("User registered");
      res.send("Registration successful!");
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
