# 🚀 DEPLOY EN RENDER - GUÍA COMPLETA

## ¿Por qué Render?
- ✅ Totalmente GRATIS (plan free forever)
- ✅ PostgreSQL incluido gratis
- ✅ Deploy automático desde GitHub
- ✅ SSL (HTTPS) gratis
- ✅ Muy fácil de configurar

---

## PASO 1: Crear cuenta en Render

1. Ve a: https://render.com
2. Clic en **"Get Started"**
3. Regístrate con tu cuenta de **GitHub** (IMPORTANTE)
4. Autoriza a Render para acceder a tus repos

---

## PASO 2: Crear Base de Datos PostgreSQL

1. En el dashboard de Render, clic en **"New +"**
2. Selecciona **"PostgreSQL"**
3. Configura así:
   - **Name:** `aki-chatbot-db`
   - **Database:** `aki_chatbot`
   - **User:** `aki_user` (o deja el default)
   - **Region:** Selecciona el más cercano a ti
   - **Plan:** **Free** (selecciona este)
4. Clic en **"Create Database"**
5. **ESPERA 2-3 MINUTOS** hasta que diga "Available"

### GUARDAR CREDENCIALES:
Una vez creada, verás:
- **Internal Database URL** (cópiala, la necesitarás)
- Algo como: `postgresql://user:password@host:5432/database`

---

## PASO 3: Crear las Tablas en PostgreSQL

### Opción A: Desde Render Dashboard
1. En tu base de datos, ve a la pestaña **"Shell"** o **"Connect"**
2. Copia y pega este SQL:

```sql
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    dni VARCHAR(50),
    edad VARCHAR(10),
    afiliado VARCHAR(100),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Clic en **"Execute"** o Enter

---

## PASO 4: Deployar tu Aplicación Web

1. En Render Dashboard, clic en **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio de GitHub: **"AKI-CHATBOOT-3.0"**
4. Configura así:

### Configuración Básica:
- **Name:** `aki-chatbot`
- **Region:** Mismo que la base de datos
- **Branch:** `main` o `principal`
- **Root Directory:** (dejar vacío)
- **Runtime:** **Node**
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Plan:
- **Instance Type:** **Free** ⭐

---

## PASO 5: Variables de Entorno

En la misma página de configuración, baja hasta **"Environment Variables"**

Agrega estas variables (clic en "Add Environment Variable"):

```
NODE_ENV = production

PORT = 3000

DB_USER = (copiar de Internal Database URL)

DB_PASSWORD = (copiar de Internal Database URL)

DB_HOST = (copiar de Internal Database URL - solo el host)

DB_PORT = 5432

DB_NAME = aki_chatbot

JWT_SECRET = aki_super_secret_key_2026_cambiar_en_produccion

GMAIL_USER = tu_cuenta@gmail.com

GMAIL_APP_PASSWORD = tu_password_de_aplicacion_gmail

CONTACT_EMAIL = tu_cuenta@gmail.com
```

⚠️ Si faltan `GMAIL_USER` o `GMAIL_APP_PASSWORD`, el formulario "Contacto Doctor" no podrá enviar correos en producción.

### 🔍 CÓMO OBTENER LOS DATOS DE LA DATABASE URL:

Si tu Internal Database URL es:
```
postgresql://aki_user:ABC123xyz@dpg-abc123.oregon-postgres.render.com:5432/aki_chatbot
```

Entonces:
- **DB_USER** = `aki_user`
- **DB_PASSWORD** = `ABC123xyz`
- **DB_HOST** = `dpg-abc123.oregon-postgres.render.com`
- **DB_PORT** = `5432`
- **DB_NAME** = `aki_chatbot`

### OPCIÓN FÁCIL:
También puedes usar directamente:
```
DATABASE_URL = (pega toda la Internal Database URL aquí)
```

Y luego modificar tu código para usar `DATABASE_URL` en lugar de las variables separadas.

---

## PASO 6: Deployar

1. Clic en **"Create Web Service"**
2. Render comenzará a:
   - Clonar tu repo
   - Instalar dependencias (npm install)
   - Iniciar el servidor (npm start)
3. **ESPERA 3-5 MINUTOS**
4. Cuando termine, verás: **"Live"** ✅

Tu URL será algo como:
```
https://aki-chatbot.onrender.com
```

---

## PASO 7: Verificar que Funciona

1. Abre tu URL de Render
2. Regístrate con un usuario nuevo
3. Crea una conversación
4. Envía mensajes
5. Cierra sesión y vuelve a entrar
6. ✅ Si las conversaciones persisten = **¡TODO FUNCIONA!**

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "Connection refused" o "Database error"
**Solución:**
- Verifica que las variables de entorno estén correctas
- Asegúrate de que la base de datos diga "Available"
- Revisa que copiaste bien la Database URL

### Error: "Module not found"
**Solución:**
- Ve a la pestaña "Logs" en Render
- Verifica que package.json esté en el repo
- Intenta hacer un "Manual Deploy"

### La página carga pero no funciona:
**Solución:**
- Ve a "Logs" y busca errores en rojo
- Verifica que las tablas estén creadas en PostgreSQL
- Comprueba que JWT_SECRET esté configurado

### Contacto Doctor no envía en Render
**Solución:**
- Verifica en Environment que existan `GMAIL_USER`, `GMAIL_APP_PASSWORD` y `CONTACT_EMAIL`
- Haz un Manual Deploy luego de guardar variables
- Prueba este endpoint para diagnóstico:
    - `https://TU-APP.onrender.com/api/email/status`
    - Verificación SMTP completa: `https://TU-APP.onrender.com/api/email/status?verify=1`
- Si `verify.ok` da `false`, revisa contraseña de aplicación de Google (no la contraseña normal)

### El servicio se "duerme":
**Normal en plan Free:**
- Después de 15 minutos sin uso, Render duerme tu app
- Al visitarla de nuevo, tarda 30 segundos en despertar
- **Solución:** Upgrade a plan Paid ($7/mes) para 24/7

---

## 💡 TIPS PROFESIONALES

### 1. Dominio Personalizado (Opcional)
- Render permite conectar tu propio dominio gratis
- Ve a Settings → Custom Domain

### 2. Auto-Deploy
- Cada vez que hagas push a GitHub = deploy automático
- Configurable en Settings → Auto-Deploy

### 3. Ver Logs en Tiempo Real
- Pestaña "Logs" para ver todo lo que pasa
- Útil para debugging

### 4. Backup de Base de Datos
- Ve a tu PostgreSQL → Info → Connection Pooling
- Descarga backups periódicos

---

## 📊 COMPARACIÓN: RENDER vs VERCEL

| Feature | Render | Vercel |
|---------|--------|--------|
| PostgreSQL incluido | ✅ Gratis | ❌ No soportado |
| Node.js backend | ✅ Perfecto | ⚠️ Serverless solo |
| Plan gratuito | ✅ Forever free | ✅ Si |
| Tiempo activo | Se duerme 15min | 24/7 |
| Setup | Muy fácil | Más complejo |

**Ganador para tu proyecto: RENDER** 🏆

---

## 🎓 RECURSOS

- Documentación Render: https://render.com/docs
- PostgreSQL en Render: https://render.com/docs/databases
- Comunidad Render: https://community.render.com

---

**¡Éxito con tu deploy! 🚀**

Cualquier problema, revisa los Logs en Render Dashboard.
