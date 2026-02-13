const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

function isMailtrapAddress(value = '') {
    const normalized = String(value).toLowerCase();
    return normalized.includes('mailtrap') || normalized.includes('sandbox.smtp');
}

function resolveContactEmail() {
    const envContactEmail = process.env.CONTACT_EMAIL;
    const gmailUser = process.env.GMAIL_USER;

    if (envContactEmail && !isMailtrapAddress(envContactEmail)) {
        return envContactEmail;
    }

    if (envContactEmail && isMailtrapAddress(envContactEmail)) {
        console.warn('⚠️ CONTACT_EMAIL apunta a Mailtrap. Se usará GMAIL_USER como destino.');
    }

    return gmailUser;
}

// Configurar multer para archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten archivos de imagen (JPG, PNG) o documentos (PDF, DOC)'));
    }
}).array('archivos', 5); // Máximo 5 archivos

// Crear transporte con Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Enviar email de contacto
exports.sendContactEmail = async (req, res) => {
    // Procesar archivos con multer
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'Error al procesar los archivos'
            });
        }

        try {
            const { nombre, email, medicacion, mensaje } = req.body;

            if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
                return res.status(500).json({
                    success: false,
                    message: 'Falta configurar GMAIL_USER o GMAIL_APP_PASSWORD en el servidor'
                });
            }

            // Validar campos
            if (!nombre || !email || !medicacion || !mensaje) {
                return res.status(400).json({
                    success: false,
                    message: 'Por favor completa todos los campos'
                });
            }

            const CONTACT_EMAIL = resolveContactEmail();

            if (!CONTACT_EMAIL) {
                return res.status(500).json({
                    success: false,
                    message: 'No hay un email de destino configurado en el servidor'
                });
            }
            
            // Preparar adjuntos si hay archivos
            const attachments = [];
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    attachments.push({
                        filename: file.originalname,
                        content: file.buffer
                    });
                });
            }

            const attachmentInfo = attachments.length > 0 
                ? `<p><strong>📎 Archivos adjuntos:</strong> ${attachments.length} archivo(s)</p>`
                : '';

            // Email al equipo de soporte
            const mailOptions = {
                from: `"AKI CHATBOT" <${process.env.GMAIL_USER}>`,
                to: CONTACT_EMAIL,
                subject: `[AKI CHATBOT] Consulta de receta de ${nombre}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #0066cc; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h2>Nueva Consulta de Receta</h2>
                        </div>
                        <div style="padding: 20px; background-color: #f5f5f5;">
                            <p><strong>Nombre:</strong> ${nombre}</p>
                            <p><strong>Email de respuesta:</strong> ${email}</p>
                            <p><strong>Medicación/Receta:</strong> ${medicacion}</p>
                            ${attachmentInfo}
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p><strong>Consulta:</strong></p>
                            <p style="background-color: white; padding: 15px; border-left: 4px solid #0066cc;">
                                ${mensaje.replace(/\n/g, '<br>')}
                            </p>
                        </div>
                        <div style="padding: 15px; background-color: #e8e8e8; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
                            <p>Este email fue enviado desde el formulario de contacto de AKI CHATBOT</p>
                        </div>
                    </div>
                `,
                replyTo: email,
                attachments: attachments
            };

            // Enviar email principal
            await transporter.sendMail(mailOptions);

            // Email de confirmación al usuario
            const confirmationEmail = {
                from: `"AKI CHATBOT" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'Hemos recibido tu consulta - AKI CHATBOT',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #0066cc; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h2>¡Consulta recibida!</h2>
                        </div>
                        <div style="padding: 20px; background-color: #f5f5f5;">
                            <p>Hola <strong>${nombre}</strong>,</p>
                            <p>Hemos recibido tu consulta sobre <strong>"${medicacion}"</strong> y te responderemos en el horario de atención.</p>
                            ${attachmentInfo}
                            <p style="background-color: white; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0;">
                                <strong>Detalles de tu consulta:</strong><br>
                                ${mensaje.replace(/\n/g, '<br>')}
                            </p>
                            <p>Te contactaremos a través de este email con la respuesta de nuestro equipo farmacéutico.</p>
                        </div>
                        <div style="padding: 15px; background-color: #e8e8e8; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
                            <p>AKI CHATBOT - Sistema de asesoramiento farmacéutico</p>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(confirmationEmail);

            return res.status(200).json({
                success: true,
                message: 'Tu consulta ha sido enviada. Recibirás una respuesta pronto.'
            });

        } catch (error) {
            console.error('Error al enviar email:', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al enviar tu consulta. Intenta de nuevo.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });
};
