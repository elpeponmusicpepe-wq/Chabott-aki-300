const { sql } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Crear un nuevo usuario
    static async create({ email, password, name, dni, edad, afiliado }) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const [user] = await sql`
                INSERT INTO users (email, password, name, dni, edad, afiliado)
                VALUES (${email}, ${hashedPassword}, ${name}, ${dni}, ${edad}, ${afiliado})
                RETURNING id, email, name, dni, edad, afiliado, created_at
            `;
            
            return user;
        } catch (error) {
            throw new Error('Error creando usuario: ' + error.message);
        }
    }

    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const [user] = await sql`
                SELECT * FROM users WHERE email = ${email}
            `;
            return user;
        } catch (error) {
            throw new Error('Error buscando usuario: ' + error.message);
        }
    }

    // Buscar usuario por ID
    static async findById(id) {
        try {
            const [user] = await sql`
                SELECT id, email, name, dni, edad, afiliado, created_at 
                FROM users WHERE id = ${id}
            `;
            return user;
        } catch (error) {
            throw new Error('Error buscando usuario: ' + error.message);
        }
    }

    // Validar contraseña
    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Actualizar perfil
    static async update(id, data) {
        try {
            const { name, dni, edad, afiliado } = data;
            const [user] = await sql`
                UPDATE users 
                SET name = ${name}, dni = ${dni}, edad = ${edad}, afiliado = ${afiliado}, updated_at = NOW()
                WHERE id = ${id}
                RETURNING id, email, name, dni, edad, afiliado, updated_at
            `;
            return user;
        } catch (error) {
            throw new Error('Error actualizando usuario: ' + error.message);
        }
    }
}

module.exports = User;
