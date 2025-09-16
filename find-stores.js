
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { lat, lng, radius } = req.query; 

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const apiKey = process.env.API_KEY;
    const endpoint = 'https://places.googleapis.com/v1/places:searchNearby';

    const requestBody = {
        includedTypes: ['comic_book_store'], 
        locationRestriction: {
            circle: {
                center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
                radius: parseFloat(radius) || 1500 
            }
        },
        languageCode: 'en',
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.id,places.rating,places.photos'
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (e) {
        console.error("Error fetching Places API:", e);
        res.status(500).json({ error: "Error fetching comic book shops." });
    }
}