const { sql } = require('../config/database');

class Conversation {
    // Crear nueva conversación
    static async create(userId, title = 'Nueva conversación') {
        try {
            const [conversation] = await sql`
                INSERT INTO conversations (user_id, title)
                VALUES (${userId}, ${title})
                RETURNING id, user_id, title, created_at, updated_at
            `;
            return conversation;
        } catch (error) {
            throw new Error('Error creando conversación: ' + error.message);
        }
    }

    // Obtener todas las conversaciones de un usuario
    static async findByUserId(userId) {
        try {
            const conversations = await sql`
                SELECT c.*, 
                       COUNT(m.id) as message_count,
                       MAX(m.created_at) as last_message_at
                FROM conversations c
                LEFT JOIN messages m ON c.id = m.conversation_id
                WHERE c.user_id = ${userId}
                GROUP BY c.id
                ORDER BY c.updated_at DESC
            `;
            return conversations;
        } catch (error) {
            throw new Error('Error obteniendo conversaciones: ' + error.message);
        }
    }

    // Obtener una conversación por ID
    static async findById(id, userId) {
        try {
            const [conversation] = await sql`
                SELECT * FROM conversations 
                WHERE id = ${id} AND user_id = ${userId}
            `;
            return conversation;
        } catch (error) {
            throw new Error('Error obteniendo conversación: ' + error.message);
        }
    }

    // Actualizar título de conversación
    static async updateTitle(id, userId, title) {
        try {
            const [conversation] = await sql`
                UPDATE conversations 
                SET title = ${title}, updated_at = NOW()
                WHERE id = ${id} AND user_id = ${userId}
                RETURNING *
            `;
            return conversation;
        } catch (error) {
            throw new Error('Error actualizando conversación: ' + error.message);
        }
    }

    // Eliminar conversación
    static async delete(id, userId) {
        try {
            await sql`
                DELETE FROM conversations 
                WHERE id = ${id} AND user_id = ${userId}
            `;
            return true;
        } catch (error) {
            throw new Error('Error eliminando conversación: ' + error.message);
        }
    }

    // Actualizar timestamp de última actividad
    static async touch(id) {
        try {
            await sql`
                UPDATE conversations 
                SET updated_at = NOW()
                WHERE id = ${id}
            `;
        } catch (error) {
            console.error('Error actualizando timestamp:', error);
        }
    }
}

module.exports = Conversation;
