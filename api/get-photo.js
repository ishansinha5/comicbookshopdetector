import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { photoreference } = req.query;

    if (!photoreference) {
        return res.status(400).json({ error: 'Photo reference is required.' });
    }

    const apiKey = process.env.API_KEY;
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoreference}&key=${apiKey}`;

    try {
        const response = await fetch(photoUrl);
        const buffer = await response.buffer();
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(buffer);
    } catch (e) {
        console.error("Error fetching photo:", e);
        res.status(500).json({ error: "Error fetching photo." });
    }
}