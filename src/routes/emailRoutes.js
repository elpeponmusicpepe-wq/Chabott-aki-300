const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/emailController');

// POST - Enviar consulta de receta
router.post('/contact', sendContactEmail);

module.exports = router;
