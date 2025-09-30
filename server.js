const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require("path");
require("dotenv").config();

const server = express();

console.log("🔧 Initializing server...");

// Middleware
server.use(cors());
console.log("✅ CORS middleware enabled");

server.use(express.json());
console.log("✅ JSON parser middleware enabled");

server.use(express.urlencoded({ extended: true }));
console.log("✅ URL-encoded parser middleware enabled");

// Serve static files
server.use(express.static(path.join(__dirname, "public")));
console.log("✅ Static files will be served from /public");

// Serve index.html
server.get("/", (req, res) => {
  console.log("📥 GET / request received — serving index.html");
  res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
    if (err) {
      console.error("❌ Error sending index.html:", err.message);
      res.status(500).send("Server error: cannot load index.html");
    } else {
      console.log("✅ index.html served successfully");
    }
  });
});

// Route to handle contact form
server.post("/contact", (req, res) => {
  console.log("📥 POST /contact request received");
  console.log("📦 Request body:", req.body);

  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    console.error("❌ Validation failed — missing fields:", req.body);
    return res.status(400).send("All fields are required.");
  }
  console.log("✅ Validation passed");

  // DB insert
  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  console.log("🛠️ Preparing SQL:", sql);

  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("❌ Database insert error:", err.message);
      return res.status(500).send("Database error");
    }

    console.log("✅ Database insert success:", {
      insertedId: result.insertId,
      name,
      email,
    });

    res.send("Message submitted successfully!");
  });
});



server.post("/api/book", (req, res) => {
    const { name, email, destination, style, budget, month, notes, date } = req.body;
    const bookingType = destination === 'other' ? 'consultation' : 'normal';

    const sql = `INSERT INTO bookings 
                 (name, email, destination, style, budget, month, notes, start_date, booking_type)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, email, destination, style, budget, month, notes, date, bookingType];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("DB Insert Error:", err);
            return res.status(500).json({ success: false, error: "Database error" });
        }
        console.log("Booking saved, ID:", result.insertId);
        res.json({ success: true, message: "Booking request saved!" });
    });
});



// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
