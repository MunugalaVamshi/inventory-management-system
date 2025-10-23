const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path'); // ✅ Required for static files
const authController = require('./controllers/authController'); 
const upload = require('./middleware/upload'); // <-- FIXED PATH



const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('✅ Uploads directory created');
}




const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static('uploads'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));


// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '11d41F@0031',
  database: process.env.DB_NAME || 'inventory_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Make `db` accessible in controllers
app.set('db', db);

// --- Auth routes ---
app.post('/api/auth/register', (req, res) => authController.register(req, res, db));
app.post('/api/auth/login', (req, res) => authController.login(req, res, db));

// Example API
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Fallback route for frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
