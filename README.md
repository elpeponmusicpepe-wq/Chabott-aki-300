# 🚀 AKI CHATBOT DEFINITIVO v1.0

**El chatbot más bonito y funcional jamás creado.**

## 📋 Requisitos

- Node.js 16+
- PostgreSQL 12+
- npm o yarn

## ⚙️ Instalación

1. **Clonar/Descargar el repositorio**
   ```bash
   cd "AKI CHATBOOT 3.0"
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copiar `.env.example` a `.env`
   - Editar `.env` con tus credenciales de PostgreSQL

4. **Inicializar base de datos**
   ```bash
   npm run build:db
   ```

## 🔥 Ejecutar el proyecto

### Desarrollo (con auto-reload)
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en: **http://localhost:3000**

## 📁 Estructura del Proyecto

```
AKI CHATBOOT 3.0/
├── src/
│   ├── server.js              # Punto de entrada
│   ├── config/
│   │   └── database.js        # Configuración PostgreSQL
│   ├── routes/
│   │   ├── authRoutes.js      # Autenticación
│   │   ├── chatRoutes.js      # Chat
│   │   └── userRoutes.js      # Usuarios
│   ├── controllers/           # Lógica de negocio
│   ├── models/                # Modelos de BD
│   └── middleware/            # Middlewares
├── public/
│   ├── index.html            # HTML principal
│   ├── css/
│   │   └── style.css         # Estilos modernos
│   └── js/
│       ├── app.js            # Lógica principal
│       ├── auth.js           # Autenticación frontend
│       ├── chat.js           # Chat frontend
│       └── ui.js             # UI interactiva
├── package.json
├── .env                      # Variables de entorno
└── README.md
```

## ✨ Características

- ✅ Interfaz moderna y responsiva
- ✅ Chat en tiempo real
- ✅ Autenticación con JWT
- ✅ Base de datos PostgreSQL
- ✅ Animaciones premium CSS3
- ✅ Reconocimiento de voz
- ✅ Adjuntos de archivos
- ✅ Historial de conversaciones
- ✅ Dark theme
- ✅ Soporte móvil completo

## 🗄️ Base de Datos

Las tablas se crean automáticamente al ejecutar:
```bash
npm run build:db
```

### Tablas:
- **users**: Usuarios del sistema
- **conversations**: Conversaciones
- **messages**: Mensajes del chat

## 🔐 Seguridad

- Contraseñas hasheadas con bcryptjs
- JWT para autenticación
- CORS habilitado
- Validación de entrada
- SQL Injection preventivo

## 📱 Responsivo

- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🎨 Tema

- Colores: Azul moderno (#3b82f6)
- Fondo: Gradiente oscuro
- Fuente: Inter
- Animaciones suaves

## 🐛 Troubleshooting

### Puerto 3000 en uso
```bash
npm start -- --port 3001
```

### Error de base de datos
- Asegurate que PostgreSQL esté corriendo
- Verifica las credenciales en `.env`

### Módulos no encontrados
```bash
npm install
npm cache clean --force
```

## 📞 Contacto

Para reportar bugs o sugerencias, contacta a tu equipo de desarrollo.

---

**Hecho con ❤️ por el equipo de AKI**
**Versión: 1.0.0 - Febrero 2026**
