import express from 'express';
import connectDB from './config/db.js';

export const app = express();

// Middleware для логування часу запиту
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/events', async (req, res) => {
    try {
        const db = await connectDB();
        
        let { page = 1, limit = 10, sort, order = 'asc', cursor } = req.query;

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        if (isNaN(page) || page < 1) {
            return res.status(400).json({ error: 'Page must be a number greater than or equal to 1' });
        }
        if (isNaN(limit) || limit < 1) {
            return res.status(400).json({ error: 'Limit must be a number greater than or equal to 1' });
        }

        // Base Query
        let querySql = 'SELECT * FROM events';
        let queryParams = [];
        let conditions = [];

        // Cursor-based pagination (Advanced)
        if (cursor) {
            conditions.push('id > ?');
            queryParams.push(parseInt(cursor, 10));
        }

        if (conditions.length > 0) {
            querySql += ' WHERE ' + conditions.join(' AND ');
        }

        // Sorting
        const allowedSortFields = ['date', 'name'];
        if (allowedSortFields.includes(sort)) {
            const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
            querySql += ` ORDER BY ${sort} ${sortOrder}`;
        }

        // Pagination
        if (!cursor) {
            // Offset/Limit format if no cursor
            const offset = (page - 1) * limit;
            querySql += ' LIMIT ? OFFSET ?';
            queryParams.push(limit, offset);
        } else {
            // Only limit if cursor is used
            querySql += ' LIMIT ?';
            queryParams.push(limit);
        }

        const events = await db.all(querySql, queryParams);

        // Fetch total count for metadata
        const totalResult = await db.get('SELECT COUNT(*) as count FROM events');
        const total = totalResult.count;

        res.json({
            total,
            page: cursor ? null : page,
            limit,
            data: events,
            nextCursor: events.length > 0 ? events[events.length - 1].id : null
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/participants/:eventId', async (req, res) => {
    try {
        const db = await connectDB();
        const { eventId } = req.params;
        const participants = await db.all('SELECT * FROM participants WHERE eventId = ?', [eventId]);
        res.json(participants);
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
