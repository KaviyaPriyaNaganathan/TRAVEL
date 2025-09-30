// db.js
const mysql = require("mysql2");
require("dotenv").config();

// Create a database connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",        // Default to localhost
    user: process.env.DB_USER || "root",             // Default user
    password: process.env.DB_PASS || "",             // Default empty password
    database: process.env.DB_NAME || "contactdb"     // Default database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error("DB connection failed:", err.message);
        process.exit(1);
    }
    console.log("Connected to database!");
});

module.exports = db;
