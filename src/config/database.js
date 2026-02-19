const postgres = require('postgres');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'aki_chatbot',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password'
};

// Crear conexión
const sql = postgres({
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password
});

// Inicializar tablas
async function initializeDatabase() {
    try {
        // Tabla de usuarios
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                dni VARCHAR(50),
                edad VARCHAR(10),
                afiliado VARCHAR(100),
                contacto VARCHAR(120),
                avatar VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS contacto VARCHAR(120)
        `;

        await sql`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS login_code VARCHAR(10)
        `;

        await sql`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS login_code_expires_at TIMESTAMP
        `;

        console.log('✅ Tabla users creada');

        // Tabla de conversaciones
        await sql`
            CREATE TABLE IF NOT EXISTS conversations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('✅ Tabla conversations creada');

        // Tabla de mensajes
        await sql`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id),
                content TEXT NOT NULL,
                role VARCHAR(50), -- 'user' o 'assistant'
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS user_documents (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                document_type VARCHAR(50) NOT NULL,
                original_name VARCHAR(255) NOT NULL,
                mime_type VARCHAR(120) NOT NULL,
                file_size INTEGER NOT NULL,
                file_data BYTEA NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('✅ Tabla messages creada');
        console.log('✅ Tabla user_documents creada');
        console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando BD:', error);
        throw error;
    }
}

// Si se ejecuta directamente
if (require.main === module) {
    initializeDatabase().then(() => process.exit(0));
}

module.exports = { sql, initializeDatabase };
