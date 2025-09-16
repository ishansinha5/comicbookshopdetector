
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { photoreference } = req.query;

    if (!photoreference) {
        return res.status(400).json({ error: 'Photo reference is required.' });
    }

    const apiKey = process.env.API_KEY;
    const endpoint = `https://places.googleapis.com/v1/${photoreference}/media?maxHeightPx=400&maxWidthPx=400`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'X-Goog-Api-Key': apiKey
            }
        });

        const locationUrl = response.headers.get('location');
        if (!locationUrl) {
             return res.status(500).json({ error: 'Could not get photo URL from API.' });
        }
        
        const photoResponse = await fetch(locationUrl);
        const buffer = await photoResponse.buffer();
        
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(buffer);
        
    } catch (e) {
        console.error("Error fetching photo:", e);
        res.status(500).json({ error: "Error fetching photo." });
    }
}