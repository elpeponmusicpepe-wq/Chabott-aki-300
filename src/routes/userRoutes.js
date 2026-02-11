const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas de usuario requieren autenticación
router.use(authMiddleware);

// Perfil
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;
