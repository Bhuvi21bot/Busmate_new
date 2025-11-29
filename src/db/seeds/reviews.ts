import { db } from '@/db';
import { reviews } from '@/db/schema';

async function main() {
    const sampleReviews = [
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 1,
            bookingId: 1,
            rating: 5,
            comment: 'Excellent driver! Very professional and on time. Clean bus and smooth ride.',
            createdAt: new Date('2024-01-16T10:30:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 2,
            bookingId: 2,
            rating: 5,
            comment: 'Great experience! Driver was courteous and the journey was comfortable.',
            createdAt: new Date('2024-01-17T14:20:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 3,
            bookingId: 3,
            rating: 4,
            comment: 'Good service overall. Minor delay but driver kept us informed.',
            createdAt: new Date('2024-01-18T09:45:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 4,
            bookingId: 4,
            rating: 5,
            comment: 'Highly recommended! Professional driver and very punctual.',
            createdAt: new Date('2024-01-19T16:15:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 5,
            bookingId: 5,
            rating: 4,
            comment: 'Driver was helpful but bus condition could be better.',
            createdAt: new Date('2024-01-20T11:00:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 6,
            bookingId: 6,
            rating: 5,
            comment: 'Comfortable journey. Would book again!',
            createdAt: new Date('2024-01-21T13:30:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 7,
            bookingId: 7,
            rating: 3,
            comment: 'Average ride. Reached destination safely but not very punctual.',
            createdAt: new Date('2024-01-22T15:45:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 8,
            bookingId: 8,
            rating: 5,
            comment: 'Professional driver. Maintained good speed and followed all rules.',
            createdAt: new Date('2024-01-23T08:20:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 1,
            bookingId: 9,
            rating: 4,
            comment: 'Nice journey but bus was a bit old.',
            createdAt: new Date('2024-01-24T12:00:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 2,
            bookingId: 10,
            rating: 5,
            comment: 'Excellent service! Very satisfied with the ride.',
            createdAt: new Date('2024-01-25T10:15:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 3,
            bookingId: 11,
            rating: 2,
            comment: 'Disappointing. Arrived 45 minutes late.',
            createdAt: new Date('2024-01-26T17:30:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 4,
            bookingId: 12,
            rating: 5,
            comment: 'Outstanding experience! Driver was friendly and very professional.',
            createdAt: new Date('2024-01-27T09:00:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 5,
            bookingId: 13,
            rating: 4,
            comment: 'Good driver but AC was not working properly.',
            createdAt: new Date('2024-01-28T14:45:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 6,
            bookingId: 14,
            rating: 5,
            comment: 'Perfect ride! Clean vehicle and smooth driving.',
            createdAt: new Date('2024-01-29T11:30:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 7,
            bookingId: 15,
            rating: 3,
            comment: 'Driver was okay but bus was not clean.',
            createdAt: new Date('2024-01-30T16:00:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 8,
            bookingId: 16,
            rating: 4,
            comment: 'Nice experience. Driver was polite and helpful.',
            createdAt: new Date('2024-01-31T13:15:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 1,
            bookingId: 17,
            rating: 5,
            comment: 'Superb service! Will definitely book again.',
            createdAt: new Date('2024-02-01T10:45:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 2,
            bookingId: 18,
            rating: 3,
            comment: 'Average experience. Driver reached late but was apologetic.',
            createdAt: new Date('2024-02-02T15:20:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 3,
            bookingId: 1,
            rating: 4,
            comment: 'Good service. Minor issues but overall satisfied.',
            createdAt: new Date('2024-02-03T12:30:00').toISOString(),
        },
        {
            userId: 'TEu8VB1NnDXbBdv22B99eFal54MN0WBb',
            driverId: 4,
            bookingId: 2,
            rating: 5,
            comment: 'Amazing ride! Driver was very experienced and made the journey enjoyable.',
            createdAt: new Date('2024-02-04T09:50:00').toISOString(),
        },
    ];

    await db.insert(reviews).values(sampleReviews);
    
    console.log('✅ Reviews seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});