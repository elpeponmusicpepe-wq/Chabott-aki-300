/**
 * AKI - Emergencies.js
 * Manejo de funcionalidad de emergencias y contacto con doctor
 */

class EmergenciesManager {
    constructor() {
        this.contactAvailabilityTimer = null;
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.init();
            });
        } else {
            // El DOM ya está listo
            this.init();
        }
    }

    init() {
        this.setupEmergenciesListeners();
        this.setupContactDoctorListeners();
        this.setupMenuListeners();
        this.setupContactAvailability();
    }

    setupEmergenciesListeners() {
        const emergenciesBtn = document.getElementById('emergencies-btn');
        const emergenciesModal = document.getElementById('emergencies-modal');
        const closeBtn = document.getElementById('close-emergencies');

        // Abrir modal
        if (emergenciesBtn) {
            emergenciesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (emergenciesModal) {
                    emergenciesModal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
            });
        }

        // Cerrar modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeEmergenciesModal();
            });
        }

        // Cerrar al hacer click fuera
        if (emergenciesModal) {
            emergenciesModal.addEventListener('click', (e) => {
                if (e.target === emergenciesModal) {
                    this.closeEmergenciesModal();
                }
            });
        }

        // Tabs del modal
        this.setupModalTabs();

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && emergenciesModal && emergenciesModal.classList.contains('open')) {
                this.closeEmergenciesModal();
            }
        });
    }

    setupContactDoctorListeners() {
        const contactBtn = document.getElementById('contact-doctor-btn');
        const contactModal = document.getElementById('contact-doctor-modal');
        const closeBtn = document.getElementById('close-contact');

        // Abrir modal
        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (contactModal) {
                    contactModal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                    this.updateContactAvailability();
                }
            });
        }

        // Cerrar modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeContactModal();
            });
        }

        // Cerrar al hacer click fuera
        if (contactModal) {
            contactModal.addEventListener('click', (e) => {
                if (e.target === contactModal) {
                    this.closeContactModal();
                }
            });
        }

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactModal && contactModal.classList.contains('open')) {
                this.closeContactModal();
            }
        });
    }

    setupContactAvailability() {
        const statusPill = document.getElementById('contact-availability');
        if (!statusPill) {
            return;
        }

        this.updateContactAvailability();

        if (this.contactAvailabilityTimer) {
            clearInterval(this.contactAvailabilityTimer);
        }

        this.contactAvailabilityTimer = setInterval(() => {
            this.updateContactAvailability();
        }, 60000);
    }

    updateContactAvailability() {
        const statusPill = document.getElementById('contact-availability');
        const statusText = document.getElementById('contact-availability-text');
        const statusDot = document.getElementById('contact-availability-dot');
        const timeLabel = document.getElementById('contact-current-time');

        if (!statusPill || !statusText) {
            return;
        }

        const now = new Date();
        const hour = now.getHours();
        const available = hour >= 8 && hour < 19;

        statusPill.classList.toggle('available', available);
        statusPill.classList.toggle('unavailable', !available);

        if (statusDot) {
            statusDot.classList.toggle('available', available);
            statusDot.classList.toggle('unavailable', !available);
        }

        statusText.textContent = available ? 'Disponible ahora' : 'No disponible';

        if (timeLabel) {
            timeLabel.textContent = now.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    setupMenuListeners() {
        const menuBtn = document.getElementById('back-to-menu-btn');
        const menuModal = document.getElementById('menu-modal');
        const closeBtn = document.getElementById('close-menu');

        if (menuBtn) {
            menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (menuModal) {
                    menuModal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeMenuModal();
            });
        }

        if (menuModal) {
            menuModal.addEventListener('click', (e) => {
                if (e.target === menuModal) {
                    this.closeMenuModal();
                }
            });

            // Cerrar al seleccionar un prompt
            menuModal.addEventListener('click', (e) => {
                if (e.target.closest('.prompt-card')) {
                    this.closeMenuModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuModal && menuModal.classList.contains('open')) {
                this.closeMenuModal();
            }
        });
    }

    setupModalTabs() {
        const tabButtons = document.querySelectorAll('.modal-tab');

        tabButtons.forEach(tab => {
            tab.addEventListener('click', () => {
                const modalContent = tab.closest('.modal-content');
                const tabName = tab.dataset.tab;

                // Remover active de todos los tabs
                modalContent.querySelectorAll('.modal-tab').forEach(t => {
                    t.classList.remove('active');
                });

                // Agregar active al clickeado
                tab.classList.add('active');

                // Mostrar contenido correspondiente
                modalContent.querySelectorAll('.modal-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const contentTarget = modalContent.querySelector(`.modal-tab-content[data-tab="${tabName}"]`);
                if (contentTarget) {
                    contentTarget.classList.add('active');
                }
            });
        });
    }

    closeEmergenciesModal() {
        const modal = document.getElementById('emergencies-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    }

    closeContactModal() {
        const modal = document.getElementById('contact-doctor-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    }

    closeMenuModal() {
        const modal = document.getElementById('menu-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    }
}

// Crear instancia global cuando se cargue el script
const emergencies = new EmergenciesManager();
