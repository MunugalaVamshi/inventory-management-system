const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');

app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

module.exports = router;
