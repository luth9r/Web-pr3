import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Змінна для зберігання з'єднання
let dbInstance = null;

const connectDB = async () => {
    if (dbInstance) {
        return dbInstance;
    }

    try {
        const dbPath = path.resolve(__dirname, '../../database.sqlite');
        
        dbInstance = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log(`SQLite Connected at ${dbPath}`);

        // Створення таблиць
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                date TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS participants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                eventId INTEGER,
                FOREIGN KEY(eventId) REFERENCES events(id)
            );

            -- Індекси для швидкого пошуку та сортування
            CREATE INDEX IF NOT EXISTS idx_events_name ON events(name);
            CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
            CREATE INDEX IF NOT EXISTS idx_participants_event_id ON participants(eventId);
        `);

        return dbInstance;
    } catch (error) {
        console.error(`Error connecting to SQLite: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
