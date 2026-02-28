import { fetchEventsService } from './service.js';

export const getEventsController = async (req, res) => {
    try {
        const data = await fetchEventsService();
        res.statusCode = 200;
        res.end(data);
    } catch (err) {
        console.error('Controller Error:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal Server Error: Failed to fetch data' }));
    }
};
