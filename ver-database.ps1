# Script para ver la base de datos PostgreSQL
# Ejecuta: .\ver-database.ps1

$env:PGPASSWORD='12345'
$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

Write-Host "`n=== BASE DE DATOS: AKI_CHATBOT ===" -ForegroundColor Cyan

Write-Host "`n[USUARIOS]" -ForegroundColor Yellow
& $psql -U postgres -d aki_chatbot -c "SELECT id, name, email, dni, edad, afiliado, created_at FROM users;"

Write-Host "`n[CONVERSACIONES]" -ForegroundColor Yellow
& $psql -U postgres -d aki_chatbot -c "SELECT id, user_id, title, created_at, updated_at FROM conversations;"

Write-Host "`n[MENSAJES - ultimos 10]" -ForegroundColor Yellow
& $psql -U postgres -d aki_chatbot -c "SELECT id, conversation_id, role, created_at FROM messages ORDER BY created_at DESC LIMIT 10;"

Write-Host "`n[ESTADISTICAS]" -ForegroundColor Green
& $psql -U postgres -d aki_chatbot -c "SELECT (SELECT COUNT(*) FROM users) as total_usuarios, (SELECT COUNT(*) FROM conversations) as total_conversaciones, (SELECT COUNT(*) FROM messages) as total_mensajes;"

Write-Host "`n=== Estructura de las Tablas ===" -ForegroundColor Cyan
Write-Host "`n[Tabla: USERS]" -ForegroundColor Magenta
& $psql -U postgres -d aki_chatbot -c "\d users"

Write-Host "`n[Tabla: CONVERSATIONS]" -ForegroundColor Magenta
& $psql -U postgres -d aki_chatbot -c "\d conversations"

Write-Host "`n[Tabla: MESSAGES]" -ForegroundColor Magenta
& $psql -U postgres -d aki_chatbot -c "\d messages"

Write-Host "`nPresiona Enter para salir..." -ForegroundColor Gray
Read-Host
