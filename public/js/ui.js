/**
 * AKI - UI.js
 * Interacciones avanzadas de interfaz de usuario
 */

class UIManager {
    constructor() {
        this.setupUIEnhancements();
    }

    setupUIEnhancements() {
        // Smooth scroll
        this.enableSmoothScroll();

        // Efectos de hover avanzados
        this.setupHoverEffects();

        // Validación de inputs
        this.setupInputValidation();

        // Tema y preferencias
        this.setupThemePreferences();

        // Animaciones de carga
        this.setupLoadingStates();
    }

    enableSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupHoverEffects() {
        const hoverElements = document.querySelectorAll('.prompt-card, .sidebar-btn, .conversation-item');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', function () {
                this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
        });
    }

    setupInputValidation() {
        const inputs = document.querySelectorAll('.message-input, .auth-form input');

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement?.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement?.classList.remove('focused');
            });
        });
    }

    setupThemePreferences() {
        // Detectar preferencia del sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        }

        // Escuchar cambios de tema del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
            if (e.matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        });
    }

    setupLoadingStates() {
        // Animación cuando se envía un mensaje
        const observer = new MutationObserver(() => {
            const sendBtn = document.getElementById('sendBtn');
            if (sendBtn && sendBtn.disabled) {
                sendBtn.style.opacity = '0.6';
            }
        });

        observer.observe(document.body, {
            attributes: true,
            subtree: true
        });
    }

    // Métodos utilitarios
    showLoadingSpinner(element) {
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    hideLoadingSpinner(element, content) {
        element.innerHTML = content;
    }

    createConfirmDialog(title, message, onConfirm, onCancel) {
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <div class="confirm-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="btn-cancel">Cancelar</button>
                    <button class="btn-confirm">Confirmar</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        dialog.querySelector('.btn-cancel').addEventListener('click', () => {
            dialog.remove();
            if (onCancel) onCancel();
        });

        dialog.querySelector('.btn-confirm').addEventListener('click', () => {
            dialog.remove();
            if (onConfirm) onConfirm();
        });
    }

    // Respuesta en tiempo real de búsqueda
    setupLiveSearch(inputSelector, resultsSelector, onSearch) {
        const input = document.querySelector(inputSelector);
        const results = document.querySelector(resultsSelector);

        if (!input) return;

        let searchTimeout;

        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length === 0) {
                results.innerHTML = '';
                return;
            }

            searchTimeout = setTimeout(() => {
                onSearch(query, results);
            }, 300);
        });
    }

    // Animar números
    animateCounter(element, start, end, duration = 1000) {
        let current = start;
        const increment = (end - start) / (duration / 16);

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    // Clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            aki.notify('Copiado al portapapeles', 'success');
        }).catch(() => {
            aki.notify('Error al copiar', 'error');
        });
    }

    // Fullscreen toggle
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {
                aki.notify('No se puede activar pantalla completa', 'warning');
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Detectar modo offline
    setupOfflineDetection() {
        window.addEventListener('offline', () => {
            aki.notify('Conexión perdida', 'error');
        });

        window.addEventListener('online', () => {
            aki.notify('Conexión restaurada', 'success');
        });
    }

    // Animación de scroll
    revealOnScroll(selector) {
        const elements = document.querySelectorAll(selector);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(el => observer.observe(el));
    }

    // Manejar formulario de contacto
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        const fileInput = document.getElementById('archivos');
        const fileLabelText = document.getElementById('file-label-text');
        
        if (!contactForm) return;

        // Mostrar nombres de archivos seleccionados
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    const fileNames = Array.from(files).map(f => f.name).join(', ');
                    fileLabelText.textContent = `${files.length} archivo(s): ${fileNames.substring(0, 30)}${fileNames.length > 30 ? '...' : ''}`;
                } else {
                    fileLabelText.textContent = 'Adjuntar fotos de receta (opcional)';
                }
            });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Usar FormData para enviar archivos
            const formData = new FormData();
            formData.append('nombre', contactForm.nombre.value);
            formData.append('email', contactForm.email.value);
            formData.append('medicacion', contactForm.medicacion.value);
            formData.append('mensaje', contactForm.mensaje.value);

            // Agregar archivos si existen
            if (fileInput && fileInput.files.length > 0) {
                for (let i = 0; i < fileInput.files.length; i++) {
                    formData.append('archivos', fileInput.files[i]);
                }
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            const requestController = new AbortController();
            const requestTimeout = setTimeout(() => {
                requestController.abort();
            }, 20000);

            try {
                const response = await fetch('/api/email/contact', {
                    method: 'POST',
                    body: formData,
                    signal: requestController.signal
                });

                const result = await response.json();

                if (response.ok) {
                    aki.notify('¡Consulta enviada exitosamente!', 'success');
                    contactForm.reset();
                    if (fileLabelText) {
                        fileLabelText.textContent = 'Adjuntar fotos de receta (opcional)';
                    }
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado';
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalHTML;
                    }, 800);
                } else {
                    aki.notify(result.message || 'Error al enviar la consulta', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                }
            } catch (error) {
                console.error('Error:', error);
                const isTimeout = error.name === 'AbortError';
                aki.notify(isTimeout ? 'El envío demoró demasiado. Intenta nuevamente.' : 'Error al conectar con el servidor', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            } finally {
                clearTimeout(requestTimeout);
            }
        });
    }
}

// Instancia global
const ui = new UIManager();

// Inicializar detección offline
ui.setupOfflineDetection();

// Inicializar formulario de contacto
document.addEventListener('DOMContentLoaded', () => {
    ui.setupContactForm();
});

console.log('🎨 UI Manager cargado exitosamente');