const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require("cors");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

dotenv.config();

const port = 3001;
const saltRound = 10;

app.use(bodyParser.json());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

app.use(cors({
    origin : ["http://localhost:3000"],
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

const createToken = (userId, username) => {
    const payload = { userId, username };
    return jwt.sign(payload, process.env.JWTTOKEN, { expiresIn: '600s' });
   };

pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      return;
    }
    console.log('Connected to database ');
  });

  app.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    pool.execute("SELECT username, password FROM users WHERE username = ?", [username], (err, results) => {
      if (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
  
      const user = results[0];
  
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          console.error('Error during password comparison:', err);
          return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
  
        if (!isValid) {
          return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        res.json({ success: true, message: 'Login successful', userId: user.id });
        //jwtoken
      });
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
app.post('/create-vault', (req, res) => {
  const vaultname = req.body.vaultname;
  const user_id = req.body.user_id;

  pool.execute('INSERT INTO vaults (user_id, vaultname) VAULES (?,?)', [user_id, vaultname], (insertErr, result) => {
    if (insertErr) {
      console.log('Error creating vault:', insertErr);
      res.status(500).json({ success: false, message: 'Internal Server Error'});
      return;
    }
    console.log('Vault created successfully')
  })
})

app.get('/Vault', (req, res) => {
  pool.query('SELECT * FROM data', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/Vault', (req, res) => {
  const { website, username, password, remarks } = req.body;

  if (!website) {
    return res.status(400).json({ success: false, message: 'Website cannot be null or empty' });
  }

  pool.query('INSERT INTO data (vault_id, website, username, password, remarks) VALUES (?, ?, ?, ?, ?)', [vault_id, website, username, password, remarks], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    res.json({ id: result.insertId });
  });
});




