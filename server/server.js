const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();

const port = 3001;
const saltRound = 10;

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT),
});

const createToken = (userId, username) => {
  const payload = { userId, username };
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "3600s" });
};

//authenticate token
function authenticateToken(req, res, next) {
  const tokenHeader = req.headers["authorization"];
  if (!tokenHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Token missing" });
  }

  const [bearer, token] = tokenHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token format" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Invalid token" });
    }

    req.user = user;
    next();
  });
}

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database ");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  pool.execute(
    "SELECT id, username, password FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error during login:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          console.error("Error during password comparison:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        if (!isValid) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid username or password" });
        }

        const token = createToken(user.id, user.username);
        console.log("token", token);
        res.json({
          success: true,
          message: "Login successful",
          userId: user.id,
          token,
        });
      });
    }
  );
});

// SIGNUP
app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRound, (err, hash) => {
    if (err) {
      console.log(err);
    }
    pool.execute(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }

        const userId = result.insertId;
        const token = createToken(userId, username);
        console.log("token", token);
        res.json({
          success: true,
          message: "User created successfully",
          userId,
          token,
        });
      }
    );
  });
});

// SAFe

app.get("/get-vault", authenticateToken, (req, res) => {
  pool.query("SELECT * FROM data", (err, results) => {
    if (err) throw err;
    let tempResults = [];
    results.forEach((result) => {
      tempResults.push({
        id: result.id,
        user_id: result.user_id,
        website: result.website,
        username: result.username,
        password: decrypt(result.password),
        remarks: result.remarks,
      });
    });
    res.json(tempResults);
  });
});

app.post("/post-vault", authenticateToken, (req, res) => {
  const { website, username, password, remarks } = req.body;
  const userId = req.user.userId; 

  if (!website) {
    return res
      .status(400)
      .json({ success: false, message: "Website cannot be null or empty" });
  }

  pool.query(
    "INSERT INTO data (user_id, website, username, password, remarks) VALUES (?, ?, ?, ?, ?)",
    [userId, website, username, encrypt(password), remarks],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
      res.json({ id: result.insertId });
    }
  );
});

app.delete("/delete-input/:id", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const inputId = req.params.id;

  pool.query(
    "SELECT user_id FROM data WHERE id = ?",
    [inputId],
    (selectErr, selectResult) => {
      if (selectErr) {
        console.error(selectErr);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (selectResult.length === 0 || selectResult[0].user_id !== userId) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: You don't have permission to delete this entry" });
      }

      pool.query(
        "DELETE FROM data WHERE id = ?",
        [inputId],
        (deleteErr, deleteResult) => {
          if (deleteErr) {
            console.error(deleteErr);
            return res
              .status(500)
              .json({ success: false, message: "Internal server error" });
          }

          res.json({ success: true, message: "Entry deleted successfully" });
        }
      );
    }
  );
});


const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.BACKEND_ENCRYPTION_KEY.toString(), "utf-8");
const iv = Buffer.from(process.env.BACKEND_ENCRYPTION_IV.toString(), "utf-8");

function encrypt(password) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedPassword = cipher.update(password, "utf-8", "hex");
  encryptedPassword += cipher.final("hex");
  return encryptedPassword;
}

function decrypt(encryptedPassword) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedPassword = decipher.update(encryptedPassword, "hex", "utf-8");
  decryptedPassword += decipher.final("utf-8");
  return decryptedPassword;
}
