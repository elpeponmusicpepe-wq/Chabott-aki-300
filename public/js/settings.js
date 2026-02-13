// ==================== SETTINGS MANAGER ====================

class SettingsManager {
    constructor() {
        console.log('⚙️ Creando SettingsManager...');
        this.modal = document.getElementById('settings-modal');
        this.defaultSettings = {
            theme: 'default',
            fontSize: 16,
            brightness: 100,
            colorblindMode: 'normal',
            modoAbuelos: false
        };
        
        this.settings = { ...this.defaultSettings };
        this.init();
    }

    init() {
        console.log('⚙️ Inicializando SettingsManager...');
        this.loadSettings();
        this.setupEventListeners();
        this.applySettings();
        console.log('✅ SettingsManager inicializado');
    }

    setupEventListeners() {
        // Color theme buttons
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = btn.dataset.theme;
                this.setTheme(theme);
            });
        });

        // Font size slider
        const fontSizeSlider = document.getElementById('font-size-slider');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                this.setFontSize(size);
            });
        }

        // Brightness slider
        const brightnessSlider = document.getElementById('brightness-slider');
        if (brightnessSlider) {
            brightnessSlider.addEventListener('input', (e) => {
                const brightness = parseInt(e.target.value);
                this.setBrightness(brightness);
            });
        }

        // Colorblind mode buttons
        const colorblindBtns = document.querySelectorAll('.colorblind-btn');
        colorblindBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const mode = btn.dataset.mode;
                this.setColorblindMode(mode);
            });
        });

        // Modo Abuelos toggle
        const modoAbuelos = document.getElementById('modo-abuelos');
        if (modoAbuelos) {
            modoAbuelos.addEventListener('change', (e) => {
                this.setModoAbuelos(e.target.checked);
            });
        }

        // Guide button
        const guideBtn = document.getElementById('guide-btn');
        if (guideBtn) {
            guideBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showGuide();
            });
        }

        // Reset button
        const resetBtn = document.querySelector('.settings-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetToDefaults());
        }
    }

    setTheme(theme) {
        this.settings.theme = theme;
        this.applyTheme(theme);
        this.updateThemeButtons(theme);
        this.saveSettings();
    }

    applyTheme(theme) {
        const root = document.documentElement;
        
        const themes = {
            'default': {
                '--primary': '#1f2937',
                '--secondary': '#111827',
                '--accent': '#3b82f6',
                '--accent-light': '#60a5fa',
                '--accent-dark': '#1d4ed8',
                '--danger': '#ef4444',
                '--success': '#10b981',
                '--warning': '#f59e0b'
            },
            'purple': {
                '--primary': '#2d1b4e',
                '--secondary': '#1a0f2e',
                '--accent': '#a78bfa',
                '--accent-light': '#c4b5fd',
                '--accent-dark': '#7c3aed',
                '--danger': '#ef4444',
                '--success': '#10b981',
                '--warning': '#f59e0b'
            },
            'green': {
                '--primary': '#1b3d2e',
                '--secondary': '#0f2818',
                '--accent': '#34d399',
                '--accent-light': '#6ee7b7',
                '--accent-dark': '#059669',
                '--danger': '#ef4444',
                '--success': '#10b981',
                '--warning': '#f59e0b'
            },
            'red': {
                '--primary': '#3d1f1f',
                '--secondary': '#2d1616',
                '--accent': '#f87171',
                '--accent-light': '#fca5a5',
                '--accent-dark': '#dc2626',
                '--danger': '#ef4444',
                '--success': '#10b981',
                '--warning': '#f59e0b'
            },
            'pink': {
                '--primary': '#3d1f32',
                '--secondary': '#2d1620',
                '--accent': '#f472b6',
                '--accent-light': '#f8a4d1',
                '--accent-dark': '#db2777',
                '--danger': '#ef4444',
                '--success': '#10b981',
                '--warning': '#f59e0b'
            },
            'cyan': {
                '--primary': '#1f3a3f',
                '--secondary': '#132a2f',
                '--accent': '#22d3ee',
                '--accent-light': '#67e8f9',
                '--accent-dark': '#0891b2',
                '--danger': '#ef4444',
                '--success': '#10b981',
                '--warning': '#f59e0b'
            }
        };

        const colors = themes[theme] || themes['default'];
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }

    updateThemeButtons(activeTheme) {
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns.forEach(btn => {
            if (btn.dataset.theme === activeTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    setFontSize(size) {
        this.settings.fontSize = size;
        const root = document.documentElement;
        root.style.setProperty('--font-size-base', `${size}px`);
        
        // Aplicar a todos los elementos
        document.documentElement.style.fontSize = `${size}px`;
        
        // Actualizar preview
        const preview = document.querySelector('.preview-text');
        if (preview) {
            preview.style.fontSize = `${size}px`;
        }
        
        this.saveSettings();
    }

    setBrightness(brightness) {
        this.settings.brightness = brightness;
        const root = document.documentElement;
        root.style.setProperty('--brightness', `${brightness}%`);
        
        // Aplicar filtro de brightness al body
        document.body.style.filter = `brightness(${brightness}%)`;
        
        // Actualizar indicador
        const indicator = document.querySelector('.brightness-indicator span');
        if (indicator) {
            indicator.textContent = `${brightness}%`;
        }
        
        this.saveSettings();
    }

    setColorblindMode(mode) {
        this.settings.colorblindMode = mode;
        this.applyColorblindFilter(mode);
        this.updateColorblindButtons(mode);
        this.saveSettings();
    }

    applyColorblindFilter(mode) {
        const body = document.body;
        
        // Remover filtros anteriores
        body.classList.remove(
            'colorblind-deuteranopia',
            'colorblind-protanopia',
            'colorblind-tritanopia'
        );

        // Aplicar nuevo filtro
        const filters = {
            'normal': 'none',
            'deuteranopia': 'url(#colorblind-deuteranopia)',
            'protanopia': 'url(#colorblind-protanopia)',
            'tritanopia': 'url(#colorblind-tritanopia)'
        };

        if (mode !== 'normal') {
            body.classList.add(`colorblind-${mode}`);
            // Aplicar filtro CSS si existe
            if (document.getElementById(filters[mode].replace('url(#', '').replace(')', ''))) {
                body.style.filter = `${filters[mode]} ${body.style.filter || 'brightness(100%)'}`;
            }
        } else {
            // Restaurar solo brightness si es normal
            const brightness = this.settings.brightness;
            body.style.filter = brightness !== 100 ? `brightness(${brightness}%)` : 'none';
        }
    }

    updateColorblindButtons(activeMode) {
        const colorblindBtns = document.querySelectorAll('.colorblind-btn');
        colorblindBtns.forEach(btn => {
            if (btn.dataset.mode === activeMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    setModoAbuelos(enabled) {
        this.settings.modoAbuelos = enabled;
        
        if (enabled) {
            document.body.classList.add('modo-abuelos');
            // Aplicar tamaño de fuente grande automáticamente
            this.setFontSize(20);
            // Aumentar espaciado
            document.documentElement.style.setProperty('--spacing-multiplier', '1.5');
        } else {
            document.body.classList.remove('modo-abuelos');
            document.documentElement.style.setProperty('--spacing-multiplier', '1');
            // Restaurar tamaño anterior
            this.setFontSize(this.settings.fontSize);
        }
        
        this.saveSettings();
    }

    showGuide() {
        const guideHTML = `
            <div style="text-align: left; max-width: 500px; margin: 0 auto;">
                <h3 style="text-align: center; margin-bottom: 20px;">📚 Guía de Configuración AKI</h3>
                
                <div style="margin-bottom: 15px;">
                    <strong>🎨 Temas de Colores:</strong><br>
                    Selecciona tu color favorito. Hay 6 opciones: Azul, Morado, Verde, Rojo, Rosa y Cian.
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>👴 Modo para Abuelos:</strong><br>
                    Activa esta opción para una interfaz más grande y simple, perfecta para personas mayores o con dificultad visual.
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>🔤 Tamaño de Letra:</strong><br>
                    Ajusta el tamaño del texto según tu preferencia. Rango: 12px (pequeño) a 20px (grande).
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>☀️ Brillo:</strong><br>
                    Controla el brillo de la pantalla. Valores entre 50% (oscuro) y 150% (muy claro).
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>🎨 Modo para Daltónicos:</strong><br>
                    • <strong>Normal:</strong> Vista estándar<br>
                    • <strong>Rojo-Verde:</strong> Para deuteranopia (dificultad con verde)<br>
                    • <strong>Rojo:</strong> Para protanopia (dificultad con rojo)<br>
                    • <strong>Azul-Amarillo:</strong> Para tritanopia (dificultad con azul y amarillo)
                </div>

                <div style="margin-top: 20px; padding: 15px; background: rgba(59, 130, 246, 0.1); border-radius: 8px;">
                    <strong>💡 Tip:</strong> Todas las configuraciones se guardan automáticamente y se mantienen cuando vuelvas a abrir AKI.
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: #1e293b;
            color: #f1f5f9;
            padding: 30px;
            border-radius: 16px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        content.innerHTML = guideHTML;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Cerrar';
        closeBtn.style.cssText = `
            margin-top: 20px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            width: 100%;
            transition: all 0.3s ease;
        `;
        closeBtn.onmouseover = () => closeBtn.style.transform = 'scale(1.02)';
        closeBtn.onmouseout = () => closeBtn.style.transform = 'scale(1)';
        closeBtn.onclick = () => modal.remove();
        
        content.appendChild(closeBtn);
        modal.appendChild(content);
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        
        document.body.appendChild(modal);
    }

    resetToDefaults() {
        if (!confirm('¿Estás seguro de que deseas restaurar la configuración por defecto?')) {
            return;
        }

        this.settings = { ...this.defaultSettings };
        this.applySettings();
        this.saveSettings();
        this.loadSettings();
    }

    loadSettings() {
        try {
            const stored = localStorage.getItem('userSettings');
            if (stored) {
                this.settings = { ...this.defaultSettings, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.error('Error cargando configuración:', error);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('userSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error guardando configuración:', error);
        }
    }

    applySettings() {
        this.applyTheme(this.settings.theme);
        this.updateThemeButtons(this.settings.theme);
        
        this.setFontSize(this.settings.fontSize);
        const fontSlider = document.getElementById('font-size-slider');
        if (fontSlider) {
            fontSlider.value = this.settings.fontSize;
        }

        this.setBrightness(this.settings.brightness);
        const brightnessSlider = document.getElementById('brightness-slider');
        if (brightnessSlider) {
            brightnessSlider.value = this.settings.brightness;
        }

        this.applyColorblindFilter(this.settings.colorblindMode);
        this.updateColorblindButtons(this.settings.colorblindMode);

        if (this.settings.modoAbuelos) {
            const modoToggle = document.getElementById('modo-abuelos');
            if (modoToggle) {
                modoToggle.checked = true;
            }
            this.setModoAbuelos(true);
        }
    }
}

// Inicializar el Settings Manager
let settingsManager = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        settingsManager = new SettingsManager();
        window.settingsManager = settingsManager;
    });
} else {
    settingsManager = new SettingsManager();
    window.settingsManager = settingsManager;
}
