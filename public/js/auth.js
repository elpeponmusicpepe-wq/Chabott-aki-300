/**
 * AKI - Auth.js
 * Manejo de autenticación y registro
 */

class AuthManager {
    constructor() {
        this.setupAuthListeners();
    }

    setupAuthListeners() {
        // Tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchAuthTab(e.target.closest('.auth-tab')));
        });

        // Formularios
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    switchAuthTab(tab) {
        // Actualizar tabs activos
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Mostrar formulario correcto
        const tabName = tab.dataset.tab;
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.querySelector(`.auth-form[data-form="${tabName}"]`).classList.add('active');
    }

    async handleLogin(e) {
        e.preventDefault();

        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        if (!email || !password) {
            aki.notify('Por favor completa todos los campos', 'warning');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Guardar token y usuario
                localStorage.setItem('akiToken', data.token);
                
                // Crear objeto de usuario completo
                const userData = {
                    name: data.user?.name || data.user?.nombre || email.split('@')[0],
                    nombre: data.user?.name || data.user?.nombre || email.split('@')[0],
                    email: data.user?.email || email,
                    dni: data.user?.dni || 'N/A',
                    edad: data.user?.edad || 'N/A',
                    afiliado: data.user?.afiliado || 'N/A'
                };
                
                localStorage.setItem('akiUser', JSON.stringify(userData));
                localStorage.setItem('userData', JSON.stringify(userData));

                // Actualizar estado
                aki.user = userData;
                
                // Actualizar UI
                const userDisplay = document.getElementById('userNameDisplay');
                if (userDisplay) {
                    userDisplay.textContent = userData.name || userData.nombre || 'Usuario';
                }

                // Actualizar perfil si existe el manager
                if (window.userProfileManager) {
                    window.userProfileManager.loadProfileData();
                }

                // Limpiar formulario
                form.reset();

                // Cerrar modal
                aki.hideAuthModal();
                aki.loadConversations();
                aki.notify('¡Bienvenido!', 'success');
            } else {
                aki.notify(data.error || 'Error al iniciar sesión', 'error');
            }
        } catch (error) {
            console.error('Error en login:', error);
            aki.notify('Error de conexión', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const form = e.target;
        const inputs = form.querySelectorAll('input');
        const name = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const confirmPassword = inputs[3].value;

        // Validaciones
        if (!name || !email || !password || !confirmPassword) {
            aki.notify('Por favor completa todos los campos', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            aki.notify('Las contraseñas no coinciden', 'error');
            return;
        }

        if (password.length < 6) {
            aki.notify('La contraseña debe tener al menos 6 caracteres', 'warning');
            return;
        }

        if (!this.isValidEmail(email)) {
            aki.notify('Email inválido', 'error');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Crear objeto de usuario completo
                const userData = {
                    name: name,
                    nombre: name,
                    email: email,
                    dni: data.user?.dni || 'N/A',
                    edad: data.user?.edad || 'N/A',
                    afiliado: data.user?.afiliado || 'N/A'
                };
                
                // Guardar datos del usuario
                localStorage.setItem('userData', JSON.stringify(userData));
                
                aki.notify('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.', 'success');
                
                // Limpiar formulario
                form.reset();

                // Volver a login
                setTimeout(() => {
                    document.querySelectorAll('.auth-tab')[0].click();
                }, 1500);
            } else {
                aki.notify(data.error || 'Error al registrarse', 'error');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            aki.notify('Error de conexión', 'error');
        }
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Instancia global
const auth = new AuthManager();
