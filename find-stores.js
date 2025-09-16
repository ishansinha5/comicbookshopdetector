import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { lat, lng, radius } = req.query; 

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
        console.error('API_KEY environment variable is not set');
        return res.status(500).json({ error: 'Server configuration error. API key not found.' });
    }

    const endpoint = 'https://places.googleapis.com/v1/places:searchNearby';

    const requestBody = {
        includedTypes: ['comic_book_store'], 
        locationRestriction: {
            circle: {
                center: { 
                    latitude: parseFloat(lat), 
                    longitude: parseFloat(lng) 
                },
                radius: parseFloat(radius) || 10000 // Default to 10km if not specified
            }
        },
        languageCode: 'en',
        maxResultCount: 20 // Limit results
    };

    try {
        console.log(`Searching for comic book stores near ${lat}, ${lng} with radius ${radius || 10000}m`);
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.id,places.rating,places.photos,places.name'
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        
        console.log('Places API response status:', response.status);
        console.log('Places API response:', JSON.stringify(data, null, 2));
        
        if (!response.ok) {
            console.error('Places API error:', data);
            return res.status(response.status).json({ 
                error: data.error?.message || `Places API returned status ${response.status}`,
                details: data
            });
        }

        // Check if we got places back
        if (!data.places || data.places.length === 0) {
            console.log('No comic book stores found in the area');
            return res.status(200).json({ 
                places: [], 
                message: 'No comic book stores found in this area' 
            });
        }

        console.log(`Found ${data.places.length} comic book store(s)`);
        res.status(200).json(data);
        
    } catch (e) {
        console.error("Error fetching Places API:", e);
        res.status(500).json({ 
            error: "Error fetching comic book shops.",
            details: e.message
        });
    }
}