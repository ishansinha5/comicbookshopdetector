import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }
    const apiKey = process.env.API_KEY;
    const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=16093&type=store&keyword=comic%20book%20shop&key=${apiKey}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        console.error("Error fetching Places API:", e);
        res.status(500).json({ error: "Error fetching comic book shops." });
    }
}