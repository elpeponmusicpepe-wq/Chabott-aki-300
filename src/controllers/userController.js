const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const ALLOWED_DOCUMENT_TYPES = new Set(['dni', 'afiliado', 'perfil', 'receta', 'otro']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx']);
const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const historyUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        const isValidExt = ALLOWED_EXTENSIONS.has(ext);
        const isValidMime = ALLOWED_MIME_TYPES.has(file.mimetype);

        if (isValidExt && isValidMime) {
            return cb(null, true);
        }

        cb(new Error('Formato no permitido. Usa JPG, PNG, WEBP, PDF, DOC o DOCX.'));
    }
}).single('documento');

function normalizeDocumentType(value = '') {
    const normalized = String(value).trim().toLowerCase();
    if (!ALLOWED_DOCUMENT_TYPES.has(normalized)) {
        return 'otro';
    }
    return normalized;
}

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
                contacto: user.contacto,
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
        const { name, dni, edad, afiliado, contacto } = req.body;

        const user = await User.update(userId, {
            name,
            dni,
            edad,
            afiliado,
            contacto
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
                afiliado: user.afiliado,
                contacto: user.contacto
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

async function getUserHistory(req, res) {
    try {
        const userId = req.user.id;
        const history = await User.getHistory(userId);

        const documents = (history.documents || []).map((doc) => ({
            id: doc.id,
            type: doc.document_type,
            originalName: doc.original_name,
            mimeType: doc.mime_type,
            fileSize: doc.file_size,
            createdAt: doc.created_at,
            previewUrl: `/api/users/history/document/${doc.id}`
        }));

        res.json({
            success: true,
            history: {
                contacto: history.contacto || '',
                documents
            }
        });
    } catch (error) {
        console.error('Error obteniendo historial de usuario:', error);
        res.status(500).json({
            success: false,
            error: 'No se pudo cargar el historial de usuario'
        });
    }
}

function uploadUserDocument(req, res) {
    historyUpload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err.message || 'Error al cargar el documento'
            });
        }

        try {
            const userId = req.user.id;
            const contacto = (req.body.contacto || '').trim();
            const documentType = normalizeDocumentType(req.body.documentType);

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'Selecciona un archivo para guardar en tu historial'
                });
            }

            const savedDocument = await User.addHistoryDocument(userId, {
                documentType,
                contacto,
                file: req.file
            });

            res.status(201).json({
                success: true,
                message: 'Documento guardado en tu historial',
                document: {
                    id: savedDocument.id,
                    type: savedDocument.document_type,
                    originalName: savedDocument.original_name,
                    mimeType: savedDocument.mime_type,
                    fileSize: savedDocument.file_size,
                    createdAt: savedDocument.created_at,
                    previewUrl: `/api/users/history/document/${savedDocument.id}`
                }
            });
        } catch (error) {
            console.error('Error guardando documento de historial:', error);
            res.status(500).json({
                success: false,
                error: 'No se pudo guardar el documento'
            });
        }
    });
}

async function getUserDocument(req, res) {
    try {
        const documentId = Number(req.params.documentId);
        const userId = req.user.id;

        if (!Number.isFinite(documentId)) {
            return res.status(400).json({
                success: false,
                error: 'Documento inválido'
            });
        }

        const document = await User.getHistoryDocumentById(documentId);

        if (!document || Number(document.user_id) !== Number(userId)) {
            return res.status(404).json({
                success: false,
                error: 'Documento no encontrado'
            });
        }

        res.setHeader('Content-Type', document.mime_type || 'application/octet-stream');
        res.setHeader('Content-Disposition', `inline; filename="${document.original_name}"`);
        res.send(document.file_data);
    } catch (error) {
        console.error('Error obteniendo documento del historial:', error);
        res.status(500).json({
            success: false,
            error: 'No se pudo abrir el documento'
        });
    }
}

module.exports = {
    getProfile,
    updateProfile,
    getUserHistory,
    uploadUserDocument,
    getUserDocument
};
