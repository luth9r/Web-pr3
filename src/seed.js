import connectDB from './config/db.js';
import 'dotenv/config';

const seedDatabase = async () => {
    try {
        const db = await connectDB();

        // Clear existing data
        await db.exec('DELETE FROM participants');
        await db.exec('DELETE FROM events');

        console.log('Cleared existing data.');

        // Dummy events
        const eventsData = [
            { name: 'Concert A', date: '2026-04-10' },
            { name: 'Meetup B', date: '2026-03-20' },
            { name: 'Conference C', date: '2026-05-15' },
            { name: 'Workshop D', date: '2026-04-05' },
            { name: 'Webinar E', date: '2026-03-15' },
            { name: 'Hackathon F', date: '2026-06-01' },
            { name: 'Exhibition G', date: '2026-05-10' },
            { name: 'Seminar H', date: '2026-04-20' },
            { name: 'Festival I', date: '2026-07-01' },
            { name: 'Party J', date: '2026-03-25' },
            { name: 'Summit K', date: '2026-06-15' },
            { name: 'Retreat L', date: '2026-05-25' },
        ];

        // Insert events
        let firstEventId = null;
        for (const [index, event] of eventsData.entries()) {
            const result = await db.run(
                'INSERT INTO events (name, date) VALUES (?, ?)',
                [event.name, event.date]
            );
            if (index === 0) {
                firstEventId = result.lastID;
            }
        }
        console.log(`Inserted ${eventsData.length} events.`);

        // Create some participants for the first event
        if (firstEventId) {
            const participantsData = [
                { name: 'John Doe', email: 'john@example.com', eventId: firstEventId },
                { name: 'Jane Smith', email: 'jane@example.com', eventId: firstEventId },
                { name: 'Alice Johnson', email: 'alice@example.com', eventId: firstEventId }
            ];

            for (const participant of participantsData) {
                await db.run(
                    'INSERT INTO participants (name, email, eventId) VALUES (?, ?, ?)',
                    [participant.name, participant.email, participant.eventId]
                );
            }
            console.log(`Inserted ${participantsData.length} participants.`);
        }

        console.log('Database seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
