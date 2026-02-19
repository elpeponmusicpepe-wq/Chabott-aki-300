// ==================== USER PROFILE MANAGER ====================

class UserProfileManager {
    constructor() {
        this.profileModal = document.getElementById('user-profile-modal');
        this.historyModal = document.getElementById('user-history-modal');
        this.logoutBtn = document.getElementById('logout-btn');
        this.userMenuBtn = document.getElementById('userMenuBtn');
        this.userHistoryBtn = document.getElementById('userHistoryBtn');
        this.settingsBtn = document.querySelector('.settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.historyForm = document.getElementById('history-form');
        this.historyFileInput = document.getElementById('history-file');
        this.historyFileLabel = document.getElementById('history-file-label');
        this.historyList = document.getElementById('history-list');
        this.historyEmpty = document.getElementById('history-empty');
        this.historyContactInput = document.getElementById('history-contact');
        this.historyFilterInfo = document.getElementById('history-filter-info');
        this.historyFilterButtons = document.querySelectorAll('.history-filter-btn');
        this.historyCurrentFilter = 'all';
        this.historyDocuments = [];
        
        this.init();
    }

    init() {
        console.log('🔧 Inicializando UserProfileManager...');
        console.log('- userMenuBtn:', this.userMenuBtn ? '✓' : '✗');
        console.log('- userHistoryBtn:', this.userHistoryBtn ? '✓' : '✗');
        console.log('- settingsBtn:', this.settingsBtn ? '✓' : '✗');
        console.log('- profileModal:', this.profileModal ? '✓' : '✗');
        console.log('- historyModal:', this.historyModal ? '✓' : '✗');
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

        if (this.userHistoryBtn) {
            this.userHistoryBtn.addEventListener('click', () => {
                this.openHistoryModal();
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

        const closeHistory = document.getElementById('close-history');
        if (closeHistory) {
            closeHistory.addEventListener('click', () => this.closeHistoryModal());
        }

        // Cerrar modales al hacer click fuera
        document.addEventListener('click', (e) => {
            if (e.target === this.profileModal) {
                this.closeProfileModal();
            }
            if (e.target === this.historyModal) {
                this.closeHistoryModal();
            }
            if (e.target === this.settingsModal) {
                this.closeSettingsModal();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProfileModal();
                this.closeHistoryModal();
                this.closeSettingsModal();
            }
        });

        this.setupHistoryFormListeners();

        // Cargar datos del perfil
        this.loadProfileData();
    }

    setupHistoryFormListeners() {
        if (this.historyFileInput && this.historyFileLabel) {
            this.historyFileInput.addEventListener('change', () => {
                const selectedFile = this.historyFileInput.files?.[0];
                this.historyFileLabel.textContent = selectedFile
                    ? `Archivo: ${selectedFile.name}`
                    : 'Subir archivo del historial';
            });
        }

        if (this.historyForm) {
            this.historyForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                await this.submitHistoryForm();
            });
        }

        if (this.historyList) {
            this.historyList.addEventListener('click', async (event) => {
                const button = event.target.closest('.history-open-btn');
                if (!button) {
                    return;
                }

                const documentId = button.getAttribute('data-document-id');
                const documentName = button.getAttribute('data-document-name') || 'documento';
                await this.openHistoryDocument(documentId, documentName);
            });
        }

        if (this.historyFilterButtons && this.historyFilterButtons.length > 0) {
            this.historyFilterButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    this.setHistoryFilter(button.getAttribute('data-filter') || 'all');
                });
            });
        }
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
                afiliado: user.afiliado || 'N/A',
                contacto: user.contacto || ''
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

    async openHistoryModal() {
        if (!this.historyModal) {
            return;
        }

        this.historyModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        await this.loadUserHistory();
    }

    closeHistoryModal() {
        if (this.historyModal) {
            this.historyModal.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    }

    getAuthToken() {
        return localStorage.getItem('akiToken');
    }

    async loadUserHistory() {
        const token = this.getAuthToken();
        if (!token) {
            if (typeof aki !== 'undefined' && aki.notify) {
                aki.notify('Inicia sesión para ver tu historial', 'warning');
            }
            return;
        }

        try {
            const response = await fetch('/api/users/history', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'No se pudo cargar el historial');
            }

            if (this.historyContactInput) {
                this.historyContactInput.value = data.history?.contacto || '';
            }

            this.historyDocuments = data.history?.documents || [];
            this.renderHistoryDocuments();
        } catch (error) {
            console.error('Error cargando historial:', error);
            if (typeof aki !== 'undefined' && aki.notify) {
                aki.notify('Error al cargar el historial de usuario', 'error');
            }
        }
    }

    setHistoryFilter(filter = 'all') {
        this.historyCurrentFilter = filter;

        if (this.historyFilterButtons && this.historyFilterButtons.length > 0) {
            this.historyFilterButtons.forEach((button) => {
                const isActive = button.getAttribute('data-filter') === filter;
                button.classList.toggle('active', isActive);
            });
        }

        this.renderHistoryDocuments();
    }

    renderHistoryDocuments(documents = this.historyDocuments) {
        if (!this.historyList || !this.historyEmpty) {
            return;
        }

        const selectedFilter = this.historyCurrentFilter || 'all';
        const filteredDocuments = selectedFilter === 'all'
            ? documents
            : documents.filter((document) => (document.type || '').toLowerCase() === selectedFilter);

        if (this.historyFilterInfo) {
            const filterLabel = selectedFilter === 'all'
                ? 'Todos'
                : this.getDocumentTypeLabel(selectedFilter);
            this.historyFilterInfo.textContent = `Mostrando: ${filterLabel} (${filteredDocuments.length})`;
        }

        if (!filteredDocuments.length) {
            this.historyEmpty.style.display = 'block';
            const emptyLabel = selectedFilter === 'all'
                ? 'Todavía no cargaste documentos.'
                : `No hay documentos cargados en ${this.getDocumentTypeLabel(selectedFilter)}.`;
            this.historyEmpty.textContent = emptyLabel;
            this.historyList.innerHTML = '';
            return;
        }

        this.historyEmpty.style.display = 'none';
        this.historyList.innerHTML = filteredDocuments.map((document) => {
            return `
                <div class="history-item">
                    <div class="history-item-main">
                        <div class="history-type">${this.getDocumentTypeLabel(document.type)}</div>
                        <div class="history-name">${this.escapeHtml(document.originalName)}</div>
                        <div class="history-meta">${this.formatFileSize(document.fileSize)} · ${this.formatDate(document.createdAt)}</div>
                    </div>
                    <button class="history-open-btn" data-document-id="${document.id}" data-document-name="${this.escapeHtml(document.originalName)}">
                        <i class="fas fa-eye"></i>
                        Ver
                    </button>
                </div>
            `;
        }).join('');
    }

    async submitHistoryForm() {
        const token = this.getAuthToken();
        if (!token) {
            if (typeof aki !== 'undefined' && aki.notify) {
                aki.notify('Inicia sesión para guardar tu historial', 'warning');
            }
            return;
        }

        if (!this.historyForm || !this.historyFileInput) {
            return;
        }

        const selectedFile = this.historyFileInput.files?.[0];
        if (!selectedFile) {
            if (typeof aki !== 'undefined' && aki.notify) {
                aki.notify('Selecciona un archivo para guardar', 'warning');
            }
            return;
        }

        const submitBtn = document.getElementById('save-history-btn');
        const originalButtonHtml = submitBtn?.innerHTML || '';
        const selectedType = document.getElementById('history-document-type')?.value || 'otro';

        const formData = new FormData();
        formData.append('documentType', selectedType);
        formData.append('contacto', this.historyContactInput?.value || '');
        formData.append('documento', selectedFile);

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        }

        try {
            const response = await fetch('/api/users/history', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'No se pudo guardar el documento');
            }

            if (typeof aki !== 'undefined' && aki.notify) {
                aki.notify('Documento guardado en tu historial', 'success');
            }

            this.historyForm.reset();
            if (this.historyFileLabel) {
                this.historyFileLabel.textContent = 'Subir archivo del historial';
            }
            await this.loadUserHistory();
            this.setHistoryFilter(selectedType);
        } catch (error) {
            console.error('Error guardando historial:', error);
            if (typeof aki !== 'undefined' && aki.notify) {
                aki.notify(error.message || 'Error guardando documento', 'error');
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalButtonHtml;
            }
        }
    }

    async openHistoryDocument(documentId, documentName) {
        const token = this.getAuthToken();
        if (!token || !documentId) {
            return;
        }

        try {
            const response = await fetch(`/api/users/history/document/${documentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo abrir el documento');
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const previewWindow = window.open(objectUrl, '_blank', 'noopener');

            if (!previewWindow) {
                const downloadLink = document.createElement('a');
                downloadLink.href = objectUrl;
                downloadLink.download = documentName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                downloadLink.remove();
            }

            setTimeout(() => URL.revokeObjectURL(objectUrl), 15000);
        } catch (error) {
            console.error('Error abriendo documento:', error);
            if (typeof aki !== 'undefined' && aki.notify) {
                aki.notify('No se pudo abrir el documento', 'error');
            }
        }
    }

    getDocumentTypeLabel(type) {
        const labels = {
            dni: 'DNI',
            afiliado: 'Carnet de afiliado',
            perfil: 'Foto de perfil',
            receta: 'Receta',
            otro: 'Otro'
        };
        return labels[type] || 'Documento';
    }

    formatFileSize(size = 0) {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    formatDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return 'Fecha no disponible';
        }

        return date.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(value = '') {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
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
        this.closeHistoryModal();

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
