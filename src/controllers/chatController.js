const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Crear nueva conversación
async function createConversation(req, res) {
    try {
        const userId = req.user.id;
        const { title } = req.body;

        const conversation = await Conversation.create(userId, title);

        res.status(201).json({
            success: true,
            conversation
        });
    } catch (error) {
        console.error('Error creando conversación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear conversación'
        });
    }
}

// Obtener todas las conversaciones del usuario
async function getConversations(req, res) {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.findByUserId(userId);

        res.json({
            success: true,
            conversations
        });
    } catch (error) {
        console.error('Error obteniendo conversaciones:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener conversaciones'
        });
    }
}

// Obtener una conversación específica con sus mensajes
async function getConversation(req, res) {
    try {
        const userId = req.user.id;
        const conversationId = req.params.id;

        const conversation = await Conversation.findById(conversationId, userId);
        
        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversación no encontrada'
            });
        }

        const messages = await Message.findByConversationId(conversationId);

        res.json({
            success: true,
            conversation: {
                ...conversation,
                messages
            }
        });
    } catch (error) {
        console.error('Error obteniendo conversación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener conversación'
        });
    }
}

// Enviar mensaje (guardar en BD)
async function sendMessage(req, res) {
    try {
        const userId = req.user.id;
        const { conversationId, content, role } = req.body;

        // Validar que la conversación pertenece al usuario
        const conversation = await Conversation.findById(conversationId, userId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversación no encontrada'
            });
        }

        // Crear mensaje
        const message = await Message.create({
            conversationId,
            userId: role === 'user' ? userId : null,
            content,
            role: role || 'user'
        });

        // Actualizar timestamp de la conversación
        await Conversation.touch(conversationId);

        res.status(201).json({
            success: true,
            message
        });
    } catch (error) {
        console.error('Error enviando mensaje:', error);
        res.status(500).json({
            success: false,
            error: 'Error al enviar mensaje'
        });
    }
}

// Actualizar título de conversación
async function updateConversation(req, res) {
    try {
        const userId = req.user.id;
        const conversationId = req.params.id;
        const { title } = req.body;

        const conversation = await Conversation.updateTitle(conversationId, userId, title);
        
        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversación no encontrada'
            });
        }

        res.json({
            success: true,
            conversation
        });
    } catch (error) {
        console.error('Error actualizando conversación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar conversación'
        });
    }
}

// Eliminar conversación
async function deleteConversation(req, res) {
    try {
        const userId = req.user.id;
        const conversationId = req.params.id;

        await Conversation.delete(conversationId, userId);

        res.json({
            success: true,
            message: 'Conversación eliminada correctamente'
        });
    } catch (error) {
        console.error('Error eliminando conversación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar conversación'
        });
    }
}

module.exports = {
    createConversation,
    getConversations,
    getConversation,
    sendMessage,
    updateConversation,
    deleteConversation
};
