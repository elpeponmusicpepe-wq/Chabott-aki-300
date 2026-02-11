# 🗄️ GUIA DE INSTALACIÓN Y USO DE POSTGRESQL

## ✅ **IMPLEMENTACIÓN COMPLETADA**

Se ha implementado exitosamente la integración con PostgreSQL para guardar:
- ✅ Usuarios (con autenticación)
- ✅ Conversaciones
- ✅ Mensajes del chat

---

## 📋 **PASOS PARA INICIAR**

### 1. **Instalar PostgreSQL**
Si no tienes PostgreSQL instalado:
- **Windows**: Descarga desde https://www.postgresql.org/download/windows/
- **Durante instalación**: Recuerda la contraseña de usuario `postgres`

### 2. **Configurar Variables de Entorno**
Edita el archivo `.env` en la raíz del proyecto:

```env
# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aki_chatbot
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI    # ⚠️ CAMBIA ESTO

# Servidor
PORT=3000

# JWT Secret
JWT_SECRET=aki_secret_key_2024_change_this_in_production
```

### 3. **Crear la Base de Datos**
Abre PowerShell y ejecuta:

```powershell
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql, crear la base de datos:
CREATE DATABASE aki_chatbot;

# Salir de psql
\q
```

### 4. **Inicializar las Tablas**
Desde la carpeta del proyecto, ejecuta:

```powershell
npm run build:db
```

Esto creará las tablas:
- `users` (usuarios)
- `conversations` (conversaciones)
- `messages` (mensajes)

### 5. **Iniciar el Servidor**
```powershell
npm start
```

O para desarrollo con auto-reload:
```powershell
npm run dev
```

---

## 🎯 **LO QUE YA FUNCIONA**

### **Backend (API REST)**
- ✅ `POST /api/auth/register` - Registrar usuario
- ✅ `POST /api/auth/login` - Iniciar sesión
- ✅ `GET /api/auth/profile` - Obtener perfil (requiere token)
- ✅ `POST /api/chat/conversations` - Crear conversación
- ✅ `GET /api/chat/conversations` - Listar conversaciones
- ✅ `GET /api/chat/conversations/:id` - Ver conversación con mensajes
- ✅ `PUT /api/chat/conversations/:id` - Actualizar título
- ✅ `DELETE /api/chat/conversations/:id` - Eliminar conversación
- ✅ `POST /api/chat/message` - Guardar mensaje
- ✅ `GET /api/users/profile` - Ver perfil
- ✅ `PUT /api/users/profile` - Actualizar perfil

### **Frontend**
- ✅ Registro y login de usuarios
- ✅ Guardado automático de conversaciones
- ✅ Guardado automático de mensajes
- ✅ Carga de conversaciones al iniciar sesión
- ✅ Cambio entre conversaciones guardadas
- ✅ Actualización automática de títulos

---

## 🔐 **SEGURIDAD**

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación con JWT
- ✅ Tokens con expiración (7 días)
- ✅ Middleware de autenticación en rutas protegidas
- ✅ Borrado en cascada (al borrar usuario, se borran sus conversaciones)

---

## 🐛 **TROUBLESHOOTING**

### Error: "Connection refused"
➡️ PostgreSQL no está corriendo. Inicia el servicio:
```powershell
# Windows (como Admin)
net start postgresql-x64-14
```

### Error: "password authentication failed"
➡️ Verifica que la contraseña en `.env` sea correcta.

### Error: "database does not exist"
➡️ Ejecuta en psql:
```sql
CREATE DATABASE aki_chatbot;
```

### Error: "relation does not exist"
➡️ Las tablas no están creadas. Ejecuta:
```powershell
npm run build:db
```

---

## 📊 **ESTRUCTURA DE LA BASE DE DATOS**

### **Tabla: users**
```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE NOT NULL)
- password (VARCHAR NOT NULL)
- name (VARCHAR)
- dni (VARCHAR)
- edad (VARCHAR)
- afiliado (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **Tabla: conversations**
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER → users)
- title (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **Tabla: messages**
```sql
- id (SERIAL PRIMARY KEY)
- conversation_id (INTEGER → conversations)
- user_id (INTEGER → users)
- content (TEXT)
- role (VARCHAR) # 'user' o 'assistant'
- created_at (TIMESTAMP)
```

---

## 🚀 **PRÓXIMOS PASOS RECOMENDADOS**

1. **Integrar IA real** (OpenAI, Claude, etc.)
2. **Agregar paginación** para conversaciones/mensajes
3. **Implementar búsqueda** en conversaciones
4. **Agregar exportación** de historial en PDF
5. **Implementar WebSockets** para chat en tiempo real
6. **Agregar panel de administración**
7. **Implementar analytics** de uso

---

## ✅ **VERIFICAR QUE TODO FUNCIONA**

1. Abre http://localhost:3000
2. Regístrate con un usuario nuevo
3. Inicia una conversación
4. Envía algunos mensajes
5. Cierra sesión y vuelve a entrar
6. ¡Tus conversaciones deberían estar guardadas! 🎉

---

**¡La integración con PostgreSQL está completa y funcionando!** 💪🚀
