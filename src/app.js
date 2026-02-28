import { eventRouter } from './modules/event/index.js';

export const app = async (req, res) => {
    // Встановлюємо загальний заголовок
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Маршрутизація до модулів
    if (req.url.startsWith('/api/events')) {
        return eventRouter(req, res);
    }

    // Якщо жоден маршрут не підійшов
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route not found' }));
};
