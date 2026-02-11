const { sql } = require('../config/database');

class Message {
    // Crear nuevo mensaje
    static async create({ conversationId, userId, content, role = 'user' }) {
        try {
            const [message] = await sql`
                INSERT INTO messages (conversation_id, user_id, content, role)
                VALUES (${conversationId}, ${userId}, ${content}, ${role})
                RETURNING *
            `;
            return message;
        } catch (error) {
            throw new Error('Error creando mensaje: ' + error.message);
        }
    }

    // Obtener todos los mensajes de una conversación
    static async findByConversationId(conversationId) {
        try {
            const messages = await sql`
                SELECT m.*, u.name as user_name, u.email as user_email
                FROM messages m
                LEFT JOIN users u ON m.user_id = u.id
                WHERE m.conversation_id = ${conversationId}
                ORDER BY m.created_at ASC
            `;
            return messages;
        } catch (error) {
            throw new Error('Error obteniendo mensajes: ' + error.message);
        }
    }

    // Obtener últimos N mensajes de una conversación
    static async getRecent(conversationId, limit = 50) {
        try {
            const messages = await sql`
                SELECT m.*, u.name as user_name
                FROM messages m
                LEFT JOIN users u ON m.user_id = u.id
                WHERE m.conversation_id = ${conversationId}
                ORDER BY m.created_at DESC
                LIMIT ${limit}
            `;
            return messages.reverse();
        } catch (error) {
            throw new Error('Error obteniendo mensajes recientes: ' + error.message);
        }
    }

    // Eliminar mensaje
    static async delete(id) {
        try {
            await sql`
                DELETE FROM messages WHERE id = ${id}
            `;
            return true;
        } catch (error) {
            throw new Error('Error eliminando mensaje: ' + error.message);
        }
    }

    // Contar mensajes de una conversación
    static async count(conversationId) {
        try {
            const [result] = await sql`
                SELECT COUNT(*) as count 
                FROM messages 
                WHERE conversation_id = ${conversationId}
            `;
            return parseInt(result.count);
        } catch (error) {
            throw new Error('Error contando mensajes: ' + error.message);
        }
    }
}

module.exports = Message;
