// ==================== USER PROFILE MANAGER ====================

class UserProfileManager {
    constructor() {
        this.profileModal = document.getElementById('user-profile-modal');
        this.logoutBtn = document.getElementById('logout-btn');
        this.userMenuBtn = document.getElementById('userMenuBtn');
        this.settingsBtn = document.querySelector('.settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        
        this.init();
    }

    init() {
        console.log('🔧 Inicializando UserProfileManager...');
        console.log('- userMenuBtn:', this.userMenuBtn ? '✓' : '✗');
        console.log('- settingsBtn:', this.settingsBtn ? '✓' : '✗');
        console.log('- profileModal:', this.profileModal ? '✓' : '✗');
        console.log('- settingsModal:', this.settingsModal ? '✓' : '✗');
        
        // Event listeners para abrir/cerrar modales
        if (this.userMenuBtn) {
            this.userMenuBtn.addEventListener('click', () => {
                console.log('🔵 Click en botón de usuario');
                this.openProfileModal();
            });
        }

        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => {
                console.log('⚙️ Click en botón de configuración');
                this.openSettingsModal();
            });
        }

        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.logout());
        }

        // Cerrar botones
        const closeProfile = document.getElementById('close-profile');
        if (closeProfile) {
            closeProfile.addEventListener('click', () => this.closeProfileModal());
        }
        
        const closeSettings = document.getElementById('close-settings');
        if (closeSettings) {
            closeSettings.addEventListener('click', () => this.closeSettingsModal());
        }

        // Cerrar modales al hacer click fuera
        document.addEventListener('click', (e) => {
            if (e.target === this.profileModal) {
                this.closeProfileModal();
            }
            if (e.target === this.settingsModal) {
                this.closeSettingsModal();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProfileModal();
                this.closeSettingsModal();
            }
        });

        // Cargar datos del perfil
        this.loadProfileData();
    }

    loadProfileData() {
        try {
            // Obtener datos del usuario desde localStorage o del DOM
            const userData = this.getUserData();
            
            // Actualizar campos del perfil
            this.updateProfileField('profile-nombre', userData.nombre || 'Usuario');
            this.updateProfileField('profile-dni', userData.dni || 'N/A');
            this.updateProfileField('profile-email', userData.email || 'correo@ejemplo.com');
            this.updateProfileField('profile-edad', userData.edad || 'N/A');
            this.updateProfileField('profile-afiliado', userData.afiliado || 'N/A');

            // Actualizar avatar con inicial del nombre
            const initial = (userData.nombre || 'U').charAt(0).toUpperCase();
            const avatarEl = document.querySelector('.profile-avatar');
            if (avatarEl) {
                avatarEl.textContent = initial;
            }
        } catch (error) {
            console.error('Error cargando datos del perfil:', error);
        }
    }

    getUserData() {
        // Intentar obtener del localStorage primero
        const stored = localStorage.getItem('userData');
        if (stored) {
            return JSON.parse(stored);
        }

        // Intentar obtener de akiUser (datos de login/registro)
        const akiUser = localStorage.getItem('akiUser');
        if (akiUser) {
            const user = JSON.parse(akiUser);
            return {
                nombre: user.name || user.nombre || 'Usuario',
                dni: user.dni || 'N/A',
                email: user.email || 'correo@ejemplo.com',
                edad: user.edad || 'N/A',
                afiliado: user.afiliado || 'N/A'
            };
        }

        // Si no hay datos, usar valores por defecto
        return {
            nombre: 'Usuario',
            dni: 'No registrado',
            email: 'No registrado',
            edad: 'No registrado',
            afiliado: 'No registrado'
        };
    }

    updateProfileField(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    openProfileModal() {
        console.log('📂 Abriendo modal de perfil...');
        if (this.profileModal) {
            this.profileModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            this.loadProfileData(); // Recargar datos al abrir
            console.log('✅ Modal de perfil abierto');
        } else {
            console.error('❌ No se encontró el modal de perfil');
        }
    }

    closeProfileModal() {
        console.log('📂 Cerrando modal de perfil...');
        if (this.profileModal) {
            this.profileModal.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    }

    openSettingsModal() {
        console.log('⚙️ Abriendo modal de configuración...');
        if (this.settingsModal) {
            this.settingsModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            // Cargar configuración guardada
            if (settingsManager) {
                settingsManager.loadSettings();
            }
            console.log('✅ Modal de configuración abierto');
        } else {
            console.error('❌ No se encontró el modal de configuración');
        }
    }

    closeSettingsModal() {
        console.log('⚙️ Cerrando modal de configuración...');
        if (this.settingsModal) {
            this.settingsModal.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    }

    logout() {
        // Confirmación
        if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            return;
        }

        // Limpiar datos
        localStorage.removeItem('userData');
        localStorage.removeItem('akiUser');
        localStorage.removeItem('akiToken');
        localStorage.removeItem('currentConversation');
        localStorage.removeItem('conversationHistory');

        // Cerrar el modal primero
        this.closeProfileModal();

        // Mostrar notificación
        if (typeof aki !== 'undefined' && aki.notify) {
            aki.notify('Sesión cerrada correctamente', 'success');
        }

        // Recargar la página para volver al estado inicial
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.userProfileManager = new UserProfileManager();
    });
} else {
    window.userProfileManager = new UserProfileManager();
}
