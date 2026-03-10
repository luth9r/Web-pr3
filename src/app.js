import express from 'express';
import { events } from './data/events.js';

export const app = express();


// Middleware для логування часу запиту
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


app.get('/events', (req, res) => {
    let { page = 1, limit = 10, sort, order = 'asc' } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Валідація Query-параметрів
    if (isNaN(page) || page < 1) {
        return res.status(400).json({ error: 'Page must be a number greater than or equal to 1' });
    }
    if (isNaN(limit) || limit < 1) {
        return res.status(400).json({ error: 'Limit must be a number greater than or equal to 1' });
    }

    let result = [...events];

    // Сортування
    if (sort === 'date' || sort === 'name') {
        result.sort((a, b) => {
            const valA = a[sort];
            const valB = b[sort];

            if (valA < valB) return order === 'desc' ? 1 : -1;
            if (valA > valB) return order === 'desc' ? -1 : 1;
            return 0;
        });
    }

    // Пагінація
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResult = result.slice(startIndex, endIndex);

    res.json({
        total: result.length,
        page,
        limit,
        data: paginatedResult
    });
});
