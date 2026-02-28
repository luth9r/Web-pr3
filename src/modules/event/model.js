import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Шлях до data.json у корені проекту
const DATA_FILE = path.join(__dirname, '../../../data.json');

export const getEventsData = async () => {
    return await readFile(DATA_FILE, 'utf-8');
};
