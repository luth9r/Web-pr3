import { getEventsController } from './controller.js';
import { URL } from 'node:url';

export const eventRouter = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/events' && req.method === 'GET') {
        return getEventsController(req, res);
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Endpoint not found in Event module' }));
};
