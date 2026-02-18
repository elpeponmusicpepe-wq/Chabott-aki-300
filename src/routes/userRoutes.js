const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas de usuario requieren autenticación
router.use(authMiddleware);

// Perfil
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Historial de usuario
router.get('/history', userController.getUserHistory);
router.post('/history', userController.uploadUserDocument);
router.get('/history/document/:documentId', userController.getUserDocument);

module.exports = router;
