const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/profile', authMiddleware, authController.getProfile);

router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Sesión cerrada' });
});

module.exports = router;
