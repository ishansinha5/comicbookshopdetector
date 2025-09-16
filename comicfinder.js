
function getLocation() {
    // Try to get user's actual location first
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                useLocation(lat, lng);
            },
            error => {
                console.log("Geolocation error:", error);
                // Fall back to test location if geolocation fails
                const lat = 38.9072; // Washington, D.C.
                const lng = -77.0369;
                useLocation(lat, lng);
                alert("Using test location (Washington, D.C.). Please enable location services for your actual location.");
            }
        );
    } else {
        // Fall back to test location if geolocation not supported
        const lat = 38.9072; // Washington, D.C.
        const lng = -77.0369;
        useLocation(lat, lng);
        alert("Geolocation not supported. Using test location (Washington, D.C.).");
    }
}

async function useLocation(lat, lng) {
    const radius = 10000; 
    const params = new URLSearchParams({
        lat: lat,
        lng: lng,
        radius: radius
    });

    const endpoint = `/api/find-stores?${params.toString()}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        console.log("API Response:", data); // Debug log
        
        // Check if we have an error
        if (data.error) {
            console.error("API Error:", data.error);
            alert(`Error: ${data.error}`);
            return;
        }
        
        // The new Places API returns results in a 'places' array
        if (data.places && data.places.length > 0) {
            displayCards(data.places);
        } else {
            console.log("No places found in response");
            alert("No comic book shops found in this area. Try a different location or increase the search radius.");
        }
    } catch (e) {
        console.error("Error fetching comic book shops:", e);
        alert("Error fetching comic book shops. Please check your internet connection and try again.");
    }
}

function displayCards(stores) {
    const container = document.querySelector('.cards');
    container.innerHTML = '';
    
    if (!stores || stores.length === 0) {
        container.innerHTML = '<p>No comic book shops found in this area 😢</p>';
        return;
    }
    
    stores.forEach((store, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'swipe-wrapper';
        wrapper.style.zIndex = 200 - i;
        
        const card = document.createElement('div');
        card.className = 'location-card';

        // Handle photo reference - the new API structure might be different
        const photoName = store.photos?.[0]?.name;
        const imgUrl = photoName ? `/api/get-photo?photoreference=${encodeURIComponent(photoName)}` : 'https://via.placeholder.com/250x150?text=No+Image';

        const comicBookShopData = {
            name: store.displayName?.text || store.name || 'Unknown Shop', 
            place_id: store.id, 
            photo: imgUrl,
            rating: store.rating || 'N/A'
        };

        card.innerHTML = `
            <img src="${imgUrl}" alt="${comicBookShopData.name}" />
            <h3>${comicBookShopData.name}</h3>
            <p>⭐️ Rating: ${comicBookShopData.rating}</p>
            <p><small>Swipe right to save 💖</small></p>
        `;

        wrapper.appendChild(card);
        container.appendChild(wrapper);

        // Make sure Hammer.js is loaded before using it
        if (typeof Hammer !== 'undefined') {
            const hammertime = new Hammer(wrapper);
            hammertime.on('swipeleft', () => {
                wrapper.style.transform = 'translateX(-150%) rotate(-15deg)';
                wrapper.style.opacity = 0;
                setTimeout(() => wrapper.remove(), 300);
            });
            
            hammertime.on('swiperight', () => {
                saveCB(JSON.stringify(comicBookShopData));
                wrapper.style.transform = 'translateX(150%) rotate(15deg)';
                wrapper.style.opacity = 0;
                setTimeout(() => wrapper.remove(), 300);
            });
        }
    });
}

function saveCB(cbJSON) {
    try {
        const cbshop = JSON.parse(cbJSON);
        let saved = JSON.parse(localStorage.getItem('savedComicBookShops') || '[]');
        
        if (!saved.find(c => c.place_id === cbshop.place_id)) {
            saved.push(cbshop);
            localStorage.setItem('savedComicBookShops', JSON.stringify(saved));
            alert(`${cbshop.name} saved!`);
        } else {
            alert(`${cbshop.name} is already saved.`);
        }
    } catch (e) {
        console.error("Error saving comic book shop:", e);
        alert("Error saving comic book shop.");
    }
}

function showSaved() {
    const container = document.querySelector('.cards');
    container.innerHTML = '';
    
    try {
        // Get saved data from local storage
        const savedShops = JSON.parse(localStorage.getItem('savedComicBookShops') || '[]');
        
        if (savedShops.length === 0) {
            container.innerHTML = '<p>No saved comic book shops yet 😢</p>';
            return; 
        }
        
        savedShops.forEach(shop => {
            const card = document.createElement('div');
            card.className = 'location-card';
            card.innerHTML = `
                <img src="${shop.photo}" alt="${shop.name}" />
                <h3>${shop.name}</h3>
                <p>⭐️ Rating: ${shop.rating}</p>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        console.error("Error loading saved shops:", e);
        container.innerHTML = '<p>Error loading saved shops 😢</p>';
    }
}