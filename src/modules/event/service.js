import { getEventsData } from './model.js';

export const fetchEventsService = async () => {
    // Business logic can be added here
    const events = await getEventsData();
    return events;
};
