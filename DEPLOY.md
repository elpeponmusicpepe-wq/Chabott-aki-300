# 🚀 GUÍA RÁPIDA: SUBIR A GITHUB Y VERCEL

## 📦 PASO 1: Preparar el Proyecto (YA ESTÁ LISTO)

✅ `.gitignore` configurado (node_modules excluido)
✅ `.env.example` creado (sin contraseñas reales)
✅ `vercel.json` configurado
✅ README.md corregido

**Tamaño sin node_modules:** ~2-5 MB (muy ligero para GitHub)

---

## 🔧 PASO 2: Instalar Git (si no lo tienes)

Descarga desde: https://git-scm.com/download/win

---

## 📤 PASO 3: Subir a GitHub

### Opción A: Desde la Terminal (RECOMENDADO)

```powershell
# 1. Inicializar Git
git init

# 2. Agregar todos los archivos (node_modules se ignora automáticamente)
git add .

# 3. Crear primer commit
git commit -m "Initial commit: AKI Chatbot v1.0"

# 4. Crear repositorio en GitHub
# Ve a: https://github.com/new
# Nombre: aki-chatbot
# Público o Privado (tu elección)
# NO marques "Add README"

# 5. Conectar con tu repositorio (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/aki-chatbot.git

# 6. Subir código
git branch -M main
git push -u origin main
```

### Opción B: GitHub Desktop (MÁS FÁCIL)

1. Descarga GitHub Desktop: https://desktop.github.com/
2. Instala y haz login con tu cuenta
3. File → Add Local Repository → Selecciona la carpeta del proyecto
4. Clic en "Publish repository"
5. Nombra el repo: "aki-chatbot"
6. Clic en "Publish"

---

## 🌐 PASO 4: Deployar en Vercel

### 1. Crear cuenta en Vercel
- Ve a: https://vercel.com/signup
- Regístrate con tu cuenta de GitHub (IMPORTANTE)

### 2. Importar proyecto
- Clic en "Add New" → "Project"
- Selecciona tu repositorio "aki-chatbot"
- Clic en "Import"

### 3. Configurar Variables de Entorno
En la página de configuración de Vercel, agrega estas variables:

```
DB_USER = postgres
DB_PASSWORD = tu_contraseña_postgresql
DB_HOST = tu_host_postgresql_en_la_nube
DB_PORT = 5432
DB_NAME = aki_chatbot
JWT_SECRET = aki_super_secret_key_2026_cambiar_en_produccion
NODE_ENV = production
```

⚠️ **IMPORTANTE:** Vercel no soporta PostgreSQL local. Necesitas:
- **Opción 1:** Neon (PostgreSQL gratis): https://neon.tech
- **Opción 2:** Supabase (PostgreSQL gratis): https://supabase.com
- **Opción 3:** Railway (PostgreSQL gratis): https://railway.app

### 4. Deployar
- Clic en "Deploy"
- Espera 2-3 minutos
- ¡Tu app estará en línea! 🎉

---

## 🗄️ PASO 5: Configurar Base de Datos en la Nube

### Opción Recomendada: Neon (PostgreSQL Gratis)

1. Ve a https://neon.tech
2. Regístrate con GitHub
3. Crea un nuevo proyecto "aki-chatbot"
4. Copia la Connection String
5. En Vercel, actualiza estas variables:
   ```
   DB_HOST = tu-proyecto.neon.tech
   DB_USER = tu_usuario_neon
   DB_PASSWORD = tu_password_neon
   DB_NAME = aki_chatbot
   DB_PORT = 5432
   ```

6. En el Query Editor de Neon, pega y ejecuta:
   ```sql
   -- Copiar el SQL de src/config/database.js
   -- (las 3 tablas: users, conversations, messages)
   ```

---

## ✅ VERIFICACIÓN

Después del deploy:

1. Abre tu URL de Vercel (ej: aki-chatbot.vercel.app)
2. Regístrate con un usuario nuevo
3. Crea una conversación
4. Envía mensajes
5. Cierra sesión y vuelve a entrar
6. ✅ Si las conversaciones persisten, ¡TODO FUNCIONA!

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot connect to database"
- Verifica que las variables de entorno estén correctas en Vercel
- Asegúrate de usar una base de datos en la nube (no localhost)

### Error: "Module not found"
- Verifica que package.json tenga todas las dependencias
- Redeploy desde Vercel

### La página no carga
- Revisa los logs en Vercel Dashboard → Tu Proyecto → Logs
- Busca errores en rojo

---

## 📱 COMPARTIR TU PROYECTO

Una vez deployado, tu chatbot estará disponible en:
```
https://aki-chatbot-tu-usuario.vercel.app
```

Puedes compartir este link con cualquiera. Es público, profesional y rápido. 🚀

---

## 💡 TIPS PROFESIONALES

1. **Dominio personalizado:** Vercel permite conectar tu propio dominio gratis
2. **Analytics:** Habilita Vercel Analytics para ver estadísticas
3. **Updates automáticos:** Cada push a GitHub = deploy automático
4. **Ramas:** Crea ramas para testing antes de production

---

## 🎓 RECURSOS ÚTILES

- Documentación Vercel: https://vercel.com/docs
- PostgreSQL en Neon: https://neon.tech/docs
- GitHub Guides: https://guides.github.com

---

**¡Éxito con tu presentación! 🌟**
