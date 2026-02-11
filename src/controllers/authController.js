const User = require('../models/User');
const jwt = require('jwt-simple');

const JWT_SECRET = process.env.JWT_SECRET || 'aki_secret_key_2024';

// Generar token JWT
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 días
    };
    return jwt.encode(payload, JWT_SECRET);
}

// Registro de usuario
async function register(req, res) {
    try {
        const { name, email, password, dni, edad, afiliado } = req.body;

        // Validaciones
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                error: 'Nombre, email y contraseña son requeridos'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'El email ya está registrado'
            });
        }

        // Crear usuario
        const user = await User.create({
            name,
            email,
            password,
            dni: dni || null,
            edad: edad || null,
            afiliado: afiliado || null
        });

        // Generar token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                dni: user.dni,
                edad: user.edad,
                afiliado: user.afiliado
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            error: 'Error al registrar usuario'
        });
    }
}

// Login de usuario
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validaciones
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Validar contraseña
        const isValid = await User.validatePassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                name: user.name,
                nombre: user.name,
                email: user.email,
                dni: user.dni,
                edad: user.edad,
                afiliado: user.afiliado
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            error: 'Error al iniciar sesión'
        });
    }
}

// Obtener perfil del usuario autenticado
async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                nombre: user.name,
                email: user.email,
                dni: user.dni,
                edad: user.edad,
                afiliado: user.afiliado
            }
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener perfil'
        });
    }
}

module.exports = {
    register,
    login,
    getProfile
};
