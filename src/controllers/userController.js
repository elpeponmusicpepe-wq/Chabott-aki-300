const User = require('../models/User');

// Obtener perfil de usuario
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
                afiliado: user.afiliado,
                created_at: user.created_at
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

// Actualizar perfil de usuario
async function updateProfile(req, res) {
    try {
        const userId = req.user.id;
        const { name, dni, edad, afiliado } = req.body;

        const user = await User.update(userId, {
            name,
            dni,
            edad,
            afiliado
        });

        res.json({
            success: true,
            message: 'Perfil actualizado correctamente',
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
        console.error('Error actualizando perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar perfil'
        });
    }
}

module.exports = {
    getProfile,
    updateProfile
};
