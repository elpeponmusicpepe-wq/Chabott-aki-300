# Configuración de Gmail para envío de correos

## Pasos para obtener tu contraseña de aplicación de Gmail:

1. **Ve a tu cuenta de Google**: https://myaccount.google.com/

2. **Activa la verificación en 2 pasos** (si no la tienes):
   - Ve a **Seguridad** → **Verificación en dos pasos**
   - Sigue los pasos para activarla

3. **Genera una contraseña de aplicación**:
   - Ve a https://myaccount.google.com/apppasswords
   - O busca "Contraseñas de aplicaciones" en la configuración de tu cuenta
   - Selecciona **"Correo"** y **"Otro (nombre personalizado)"**
   - Escribe: "AKI Chatbot"
   - Haz clic en **"Generar"**
   - Google te mostrará una contraseña de 16 caracteres

4. **Copia la contraseña** y pégala en el archivo `.env`:
   ```
   GMAIL_APP_PASSWORD=tu_contraseña_de_16_caracteres
   ```

5. **Reinicia el servidor** para que tome los cambios

## Notas importantes:

- ⚠️ NO uses tu contraseña normal de Gmail, usa la contraseña de aplicación
- ⚠️ La contraseña de aplicación es de 16 caracteres sin espacios
- ✅ Los correos llegarán directamente a roronoazoroxoro@gmail.com
- ✅ Los usuarios recibirán un email de confirmación automático

## ¿Problemas?

Si Gmail bloquea el envío:
1. Verifica que la verificación en 2 pasos esté activa
2. Asegúrate de usar la contraseña de aplicación, no tu contraseña normal
3. Verifica que el email en `.env` sea correcto
