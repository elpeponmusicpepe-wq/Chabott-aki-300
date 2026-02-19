const User = require('../models/User');
const jwt = require('jwt-simple');
const nodemailer = require('nodemailer');
const sendgridMail = require('@sendgrid/mail');

const JWT_SECRET = process.env.JWT_SECRET || 'aki_secret_key_2024';

const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

function hasSendGridConfig() {
    return Boolean(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL);
}

function hasGmailConfig() {
    return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function buildAppBaseUrl() {
    return process.env.APP_BASE_URL
        || process.env.RENDER_EXTERNAL_URL
        || `http://localhost:${process.env.PORT || 3000}`;
}

function generateLoginCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendRegistrationLoginCodeEmail({ name, email, loginCode }) {
    const appBaseUrl = buildAppBaseUrl();
    const loginLink = `${appBaseUrl}/?auth=login&email=${encodeURIComponent(email)}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #0f172a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0;">GRACIAS POR REGISTRARTE EN AKI</h2>
            </div>
            <div style="padding: 20px; background-color: #f8fafc; color: #0f172a;">
                <p>Hola <strong>${name}</strong>,</p>
                <p>Tu código de login para el primer ingreso es:</p>
                <p style="font-size: 30px; letter-spacing: 4px; font-weight: bold; margin: 16px 0;">${loginCode}</p>
                <p style="margin-top: 0;">Este código vence en 24 horas.</p>
                <div style="margin-top: 24px; text-align: center;">
                    <a href="${loginLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">TOCA AQUÍ PARA SEGUIR EN LA PANTALLA DE LOGIN</a>
                </div>
            </div>
        </div>
    `;

    const providers = [];
    if (hasSendGridConfig()) {
        providers.push('sendgrid');
    }
    if (hasGmailConfig()) {
        providers.push('gmail');
    }

    if (providers.length === 0) {
        throw new Error('No hay proveedor de correo configurado');
    }

    let lastError = null;

    for (const provider of providers) {
        try {
            if (provider === 'sendgrid') {
                sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
                await sendgridMail.send({
                    to: email,
                    from: {
                        email: process.env.SENDGRID_FROM_EMAIL,
                        name: 'AKI'
                    },
                    subject: 'GRACIAS POR REGISTRARTE EN AKI - Código de login',
                    html
                });
                return;
            }

            await gmailTransporter.sendMail({
                from: `"AKI" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'GRACIAS POR REGISTRARTE EN AKI - Código de login',
                html
            });
            return;
        } catch (error) {
            lastError = error;
            console.error(`Error enviando email de registro con ${provider}:`, error?.message || error);
        }
    }

    throw new Error(lastError?.message || 'No se pudo enviar el email de registro');
}

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
        const { name, email, password, dni, edad, afiliado, contacto } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();

        // Validaciones
        if (!normalizedEmail || !password || !name || !dni || !edad || !afiliado) {
            return res.status(400).json({
                success: false,
                error: 'Nombre, email, DNI, edad, afiliado y contraseña son requeridos'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findByEmail(normalizedEmail);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'El email ya está registrado. Inicia sesión con ese correo.',
                requiresLogin: true
            });
        }

        // Crear usuario
        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            dni: dni || null,
            edad: edad || null,
            afiliado: afiliado || null,
            contacto: contacto || null
        });

        const loginCode = generateLoginCode();
        const loginCodeExpiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000));
        await User.setLoginCode(user.id, loginCode, loginCodeExpiresAt);

        let loginCodeEmailSent = true;
        try {
            await sendRegistrationLoginCodeEmail({
                name: user.name,
                email: user.email,
                loginCode
            });
        } catch (mailError) {
            loginCodeEmailSent = false;
            console.error('No se pudo enviar el código de login tras registro:', mailError?.message || mailError);
        }

        // Generar token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: loginCodeEmailSent
                ? 'Usuario registrado exitosamente. Te enviamos un código de login a tu correo.'
                : 'Usuario registrado exitosamente. No se pudo enviar el código de login por correo.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                dni: user.dni,
                edad: user.edad,
                afiliado: user.afiliado,
                contacto: user.contacto
            },
            loginCodeEmailSent
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
        const { email, password, loginCode } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();

        // Validaciones
        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const user = await User.findByEmail(normalizedEmail);
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

        if (user.login_code) {
            const normalizedCode = String(loginCode || '').trim();
            const expiresAt = user.login_code_expires_at ? new Date(user.login_code_expires_at).getTime() : null;

            if (expiresAt && expiresAt < Date.now()) {
                await User.clearLoginCode(user.id);
                return res.status(401).json({
                    success: false,
                    error: 'Tu código de login expiró. Regístrate nuevamente o solicita ayuda.'
                });
            }

            if (!normalizedCode) {
                return res.status(400).json({
                    success: false,
                    error: 'Debes ingresar el código de login que te enviamos al correo.'
                });
            }

            if (normalizedCode !== String(user.login_code)) {
                return res.status(401).json({
                    success: false,
                    error: 'Código de login inválido'
                });
            }

            await User.clearLoginCode(user.id);
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
                afiliado: user.afiliado,
                contacto: user.contacto
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
                afiliado: user.afiliado,
                contacto: user.contacto
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
