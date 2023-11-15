const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require("cors");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const port = 3000;
const saltRound = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

app.use(cors({
    origin : ["http://localhost:3001"],
    methods : ["GET", "POST", "DELETE"],
    credentials: true,
  }))


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
  })

pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      return;
    }
    console.log('Connected to database ');
  });

  app.post("/login", (req, res) => {
    const { username, password } = req.body;

    pool.execute("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (results.length > 0) {
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    });
  });

  //SIGNUP
  app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRound, (err, hash) => {
      if(err) {
        console.log(err)
      }
      pool.execute("INSERT INTO users (username, password) VALUES (?,?)", [username, hash],
      (err, result) => {
        console.log(err);
      })
      res.json({ success: true, message: 'User created successfully' });
    })
  });

//SAFE
app.get('/Vault', (req, res) => {
  pool.query('SELECT * FROM data', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/Vault', (req, res) => {
  const { website, username, password, remarks } = req.body;
  pool.query('INSERT INTO data (website, username, password, remarks) VALUES (?, ?, ?, ?)', [website, username, password, remarks], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId });
  });
});



