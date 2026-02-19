/**
 * AKI - Auth.js
 * Manejo de autenticación y registro
 */

class AuthManager {
    constructor() {
        this.setupAuthListeners();
        this.handleAuthDeepLink();
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
        const email = form.querySelector('input[name="email"]')?.value?.trim();
        const password = form.querySelector('input[name="password"]')?.value;
        const loginCode = form.querySelector('input[name="loginCode"]')?.value?.trim();

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
                body: JSON.stringify({
                    email,
                    password,
                    loginCode: loginCode || undefined
                })
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
        const name = form.querySelector('input[name="name"]')?.value.trim();
        const email = form.querySelector('input[name="email"]')?.value.trim();
        const dni = form.querySelector('input[name="dni"]')?.value.trim();
        const edad = form.querySelector('input[name="edad"]')?.value.trim();
        const afiliado = form.querySelector('input[name="afiliado"]')?.value.trim();
        const password = form.querySelector('input[name="password"]')?.value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]')?.value;

        // Validaciones
        if (!name || !email || !dni || !edad || !afiliado || !password || !confirmPassword) {
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

        if (!/^\d+$/.test(edad) || Number(edad) < 1 || Number(edad) > 120) {
            aki.notify('Edad inválida', 'error');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, dni, edad, afiliado, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Crear objeto de usuario completo
                const userData = {
                    name: name,
                    nombre: name,
                    email: email,
                    dni: data.user?.dni || dni,
                    edad: data.user?.edad || edad,
                    afiliado: data.user?.afiliado || afiliado
                };
                
                // Guardar datos del usuario
                localStorage.setItem('userData', JSON.stringify(userData));
                
                const registerMessage = data.loginCodeEmailSent
                    ? '¡Cuenta creada! Te enviamos un código de login al correo.'
                    : '¡Cuenta creada! Hubo un problema enviando el código de login al correo.';

                aki.notify(registerMessage, data.loginCodeEmailSent ? 'success' : 'warning');
                
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

    handleAuthDeepLink() {
        const params = new URLSearchParams(window.location.search);
        const authAction = params.get('auth');

        if (authAction !== 'login') {
            return;
        }

        const email = params.get('email');
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.remove('hidden');
        }

        document.body.style.overflow = 'hidden';

        const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
        if (loginTab) {
            this.switchAuthTab(loginTab);
        }

        const loginForm = document.getElementById('loginForm');
        if (loginForm && email) {
            const emailInput = loginForm.querySelector('input[name="email"]');
            if (emailInput) {
                emailInput.value = email;
            }
        }

        if (window.aki?.notify) {
            window.aki.notify('Ingresa tu código de login del correo para continuar.', 'info');
        }

        params.delete('auth');
        params.delete('email');
        const cleanQuery = params.toString();
        const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}${window.location.hash || ''}`;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

// Instancia global
const auth = new AuthManager();
