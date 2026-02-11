const jwt = require('jwt-simple');

const JWT_SECRET = process.env.JWT_SECRET || 'aki_secret_key_2024';

function authMiddleware(req, res, next) {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: 'Token no proporcionado'
            });
        }

        // Formato: "Bearer TOKEN"
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token inválido'
            });
        }

        // Decodificar y verificar token
        const decoded = jwt.decode(token, JWT_SECRET);
        
        // Verificar expiración
        if (decoded.exp && decoded.exp < Date.now()) {
            return res.status(401).json({
                success: false,
                error: 'Token expirado'
            });
        }

        // Agregar usuario a request
        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        return res.status(401).json({
            success: false,
            error: 'Token inválido'
        });
    }
}

module.exports = authMiddleware;
