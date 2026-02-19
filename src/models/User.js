const { sql } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Crear un nuevo usuario
    static async create({ email, password, name, dni = null, edad = null, afiliado = null, contacto = null }) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const safeDni = dni ?? null;
            const safeEdad = edad ?? null;
            const safeAfiliado = afiliado ?? null;
            const safeContacto = contacto ?? null;
            
            const [user] = await sql`
                INSERT INTO users (email, password, name, dni, edad, afiliado, contacto)
                VALUES (${email}, ${hashedPassword}, ${name}, ${safeDni}, ${safeEdad}, ${safeAfiliado}, ${safeContacto})
                RETURNING id, email, name, dni, edad, afiliado, contacto, created_at
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
                SELECT id, email, name, dni, edad, afiliado, contacto, created_at 
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
            const { name, dni, edad, afiliado, contacto } = data;
            const safeName = name ?? null;
            const safeDni = dni ?? null;
            const safeEdad = edad ?? null;
            const safeAfiliado = afiliado ?? null;
            const safeContacto = contacto ?? null;
            const [user] = await sql`
                UPDATE users 
                SET name = ${safeName}, dni = ${safeDni}, edad = ${safeEdad}, afiliado = ${safeAfiliado}, contacto = ${safeContacto}, updated_at = NOW()
                WHERE id = ${id}
                RETURNING id, email, name, dni, edad, afiliado, contacto, updated_at
            `;
            return user;
        } catch (error) {
            throw new Error('Error actualizando usuario: ' + error.message);
        }
    }

    static async setLoginCode(id, code, expiresAt) {
        try {
            await sql`
                UPDATE users
                SET login_code = ${code}, login_code_expires_at = ${expiresAt}, updated_at = NOW()
                WHERE id = ${id}
            `;
        } catch (error) {
            throw new Error('Error guardando código de login: ' + error.message);
        }
    }

    static async clearLoginCode(id) {
        try {
            await sql`
                UPDATE users
                SET login_code = NULL, login_code_expires_at = NULL, updated_at = NOW()
                WHERE id = ${id}
            `;
        } catch (error) {
            throw new Error('Error limpiando código de login: ' + error.message);
        }
    }

    static async getHistory(userId) {
        try {
            const [user] = await sql`
                SELECT contacto FROM users WHERE id = ${userId}
            `;

            const documents = await sql`
                SELECT id, document_type, original_name, mime_type, file_size, created_at
                FROM user_documents
                WHERE user_id = ${userId}
                ORDER BY created_at DESC
            `;

            return {
                contacto: user?.contacto || '',
                documents
            };
        } catch (error) {
            throw new Error('Error obteniendo historial: ' + error.message);
        }
    }

    static async addHistoryDocument(userId, { documentType, contacto, file }) {
        try {
            if (typeof contacto === 'string') {
                await sql`
                    UPDATE users
                    SET contacto = ${contacto.trim()}, updated_at = NOW()
                    WHERE id = ${userId}
                `;
            }

            const [document] = await sql`
                INSERT INTO user_documents (user_id, document_type, original_name, mime_type, file_size, file_data)
                VALUES (${userId}, ${documentType}, ${file.originalname}, ${file.mimetype}, ${file.size}, ${file.buffer})
                RETURNING id, document_type, original_name, mime_type, file_size, created_at
            `;

            return document;
        } catch (error) {
            throw new Error('Error guardando documento: ' + error.message);
        }
    }

    static async getHistoryDocumentById(documentId) {
        try {
            const [document] = await sql`
                SELECT id, user_id, document_type, original_name, mime_type, file_size, file_data, created_at
                FROM user_documents
                WHERE id = ${documentId}
            `;

            return document;
        } catch (error) {
            throw new Error('Error obteniendo documento: ' + error.message);
        }
    }
}

module.exports = User;
