const express = require('express');
const router = express.Router();
const { sendContactEmail, getEmailStatus } = require('../controllers/emailController');

// GET - Estado de configuración SMTP
router.get('/status', getEmailStatus);

// POST - Enviar consulta de receta
router.post('/contact', sendContactEmail);

module.exports = router;
