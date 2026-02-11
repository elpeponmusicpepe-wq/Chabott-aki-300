/**
 * AKI CHATBOT DEFINITIVO
 * App.js - Inicialización y control principal
 */

class AKIPlatform {
    constructor() {
        this.user = null;
        this.conversations = [];
        this.currentConversation = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando AKI Platform...');
        
        this.setupEventListeners();
        this.checkAuthStatus();
        
        this.isInitialized = true;
        console.log('✅ AKI Platform inicializado');
    }

    setupEventListeners() {
        // Nuevo chat
        document.getElementById('newChatBtn').addEventListener('click', () => this.createNewChat());

        // Los botones de usuario y configuración son manejados por userProfile.js
        // No los manejamos aquí para evitar conflictos

        // Responsive - Sidebar toggle en móvil
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    checkAuthStatus() {
        const token = localStorage.getItem('akiToken');
        const userDataStr = localStorage.getItem('akiUser');

        if (token && userDataStr) {
            try {
                this.user = JSON.parse(userDataStr);
                
                // Actualizar nombre de usuario en la UI
                const userDisplay = document.getElementById('userNameDisplay');
                if (userDisplay && this.user) {
                    userDisplay.textContent = this.user.name || this.user.nombre || 'Usuario';
                }
                
                this.hideAuthModal();
                this.loadConversations();
            } catch (error) {
                console.error('Error cargando usuario:', error);
                this.showAuthModal();
            }
        } else {
            this.showAuthModal();
        }
    }

    async createNewChat() {
        try {
            const token = localStorage.getItem('akiToken');
            if (!token) {
                this.showAuthModal();
                return;
            }

            // Crear conversación en el servidor
            const response = await fetch('/api/chat/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: 'Nueva conversación' })
            });

            if (!response.ok) {
                throw new Error('Error creando conversación');
            }

            const data = await response.json();
            const newConversation = {
                ...data.conversation,
                messages: []
            };

            this.currentConversation = newConversation;
            this.conversations.unshift(newConversation);
            
            this.renderConversations();
            this.clearChatArea();
            
            this.notify('Nueva conversación creada', 'success');
        } catch (error) {
            console.error('Error creando chat:', error);
            this.notify('Error al crear conversación', 'error');
        }
    }

    async loadConversations() {
        try {
            const response = await fetch('/api/chat/conversations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('akiToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.conversations = data.conversations || [];
                this.renderConversations();
            }
        } catch (error) {
            console.error('Error cargando conversaciones:', error);
        }
    }

    renderConversations() {
        const container = document.getElementById('conversationsContainer');
        
        if (this.conversations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <p>Sin conversaciones aún</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.conversations.map(conv => `
            <div class="conversation-item ${conv.id === this.currentConversation?.id ? 'active' : ''}" 
                 data-id="${conv.id}">
                <i class="fas fa-comment-dots"></i>
                ${conv.title}
            </div>
        `).join('');

        // Event listeners
        container.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const conv = this.conversations.find(c => c.id === id);
                this.switchConversation(conv);
            });
        });
    }

    async switchConversation(conversation) {
        this.currentConversation = conversation;
        this.renderConversations();
        
        // Cargar mensajes de la conversación desde la BD
        try {
            const token = localStorage.getItem('akiToken');
            if (token && conversation.id) {
                const response = await fetch(`/api/chat/conversations/${conversation.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.conversation && data.conversation.messages) {
                        this.currentConversation.messages = data.conversation.messages;
                    }
                }
            }
        } catch (error) {
            console.error('Error cargando mensajes:', error);
        }
        
        this.renderMessages();
    }

    clearChatArea() {
        const messagesContainer = document.getElementById('messagesContainer');
        
        messagesContainer.innerHTML = `
            <div class="welcome-section">
                <div class="welcome-content">
                    <div class="welcome-icon">
                        <i class="fas fa-sparkles"></i>
                    </div>
                    <h1>Bienvenido a AKI</h1>
                    <p>Tu asistente inteligente basado en IA</p>
                    
                    <div class="quick-prompts">
                        <button class="prompt-card" data-prompt="Explícame cómo funcionas">
                            <i class="fas fa-robot"></i>
                            <span>¿Cómo funcionas?</span>
                        </button>
                        <button class="prompt-card" data-prompt="Cuéntame un dato interesante">
                            <i class="fas fa-lightbulb"></i>
                            <span>Dato interesante</span>
                        </button>
                        <button class="prompt-card" data-prompt="Ayuda con programación">
                            <i class="fas fa-code"></i>
                            <span>Programación</span>
                        </button>
                        <button class="prompt-card" data-prompt="Escribe un poema creativo">
                            <i class="fas fa-feather"></i>
                            <span>Poema creativo</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Event listeners para prompts rápidos
        messagesContainer.querySelectorAll('.prompt-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.dataset.prompt;
                chat.sendMessage(prompt);
            });
        });
    }

    renderMessages() {
        const messagesContainer = document.getElementById('messagesContainer');
        
        if (!this.currentConversation?.messages || this.currentConversation.messages.length === 0) {
            this.clearChatArea();
            return;
        }

        const messagesHtml = this.currentConversation.messages.map(msg => `
            <div class="message ${msg.role}">
                <div class="message-avatar">
                    ${msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div class="message-content">
                    <div class="message-text">${this.escapeHtml(msg.content)}</div>
                    <div class="message-time">${new Date(msg.createdAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</div>
                </div>
            </div>
        `).join('');

        messagesContainer.innerHTML = messagesHtml;
        this.scrollToBottom();
    }

    scrollToBottom() {
        const container = document.getElementById('messagesContainer');
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 0);
    }

    async addMessage(role, content) {
        if (!this.currentConversation) {
            await this.createNewChat();
        }

        const message = {
            role,
            content,
            createdAt: new Date()
        };

        this.currentConversation.messages.push(message);
        this.renderMessages();

        // Guardar en la base de datos de forma asíncrona
        try {
            const token = localStorage.getItem('akiToken');
            if (token && this.currentConversation.id) {
                await fetch('/api/chat/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        conversationId: this.currentConversation.id,
                        content,
                        role
                    })
                });
            }
        } catch (error) {
            console.error('Error guardando mensaje:', error);
            // No mostrar error al usuario, el mensaje ya está visible localmente
        }
    }

    async updateConversationTitle(firstMessage) {
        if (!this.currentConversation || !this.currentConversation.id) return;

        const title = firstMessage.substring(0, 40) + (firstMessage.length > 40 ? '...' : '');
        this.currentConversation.title = title;
        this.renderConversations();

        // Actualizar en la base de datos
        try {
            const token = localStorage.getItem('akiToken');
            if (token) {
                await fetch(`/api/chat/conversations/${this.currentConversation.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title })
                });
            }
        } catch (error) {
            console.error('Error actualizando título:', error);
        }
    }

    openUserMenu() {
        // Este método ahora es manejado por UserProfileManager
        // Mantenemos el método para compatibilidad pero delegamos al manager
        if (window.userProfileManager) {
            window.userProfileManager.openProfileModal();
        }
    }

    logout() {
        localStorage.removeItem('akiToken');
        localStorage.removeItem('akiUser');
        localStorage.removeItem('userData');
        localStorage.removeItem('currentConversation');
        localStorage.removeItem('conversationHistory');
        this.user = null;
        this.conversations = [];
        this.currentConversation = null;
        
        this.showAuthModal();
        this.notify('Sesión cerrada', 'success');
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    notify(message, type = 'info') {
        const container = document.getElementById('notificationsContainer');
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Instancia global
const aki = new AKIPlatform();

// Estilos para fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
`;
document.head.appendChild(style);

console.log('✨ ¡Bienvenido a AKI CHATBOT DEFINITIVO! ✨');
