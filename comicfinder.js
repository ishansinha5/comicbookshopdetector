function getLocation() {
    const cache = JSON.parse(localStorage.getItem('cachedLocation') || '{}');
    const now = Date.now();
    if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
        useLocation(cache.lat, cache.lng);
    } else {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            localStorage.setItem('cachedLocation', JSON.stringify({ lat, lng, timestamp: now }));
            useLocation(lat, lng);
        }, () => alert("Location access denied or unavailable."));
    }
}
async function useLocation(lat, lng) {
    const endpoint = `/api/find-stores?lat=${lat}&lng=${lng}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
            displayCards(data.results);
        } else {
            alert("No comic book shops found.");
        }
    } catch (e) {
        console.error("Error fetching Places API:", e);
        alert("Error fetching comic book shops.");
    }
}

function displayCards(stores) {
    const container = document.querySelector('.cards');
    container.innerHTML = '';
    
    stores.forEach((store, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'swipe-wrapper';
        wrapper.style.zIndex = 200 - i;
        
        const card = document.createElement('div');
        card.className = 'location-card';

        const imgUrl = store.photos?.[0]?.photo_reference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${store.photos[0].photo_reference}&key=${apiKey}`
            : 'https://via.placeholder.com/250x150?text=No+Image';

        const comicBookShopData = {
            name: store.name,
            place_id: store.place_id,
            photo: imgUrl,
            rating: store.rating || 'N/A'
        };

        card.innerHTML = `
            <img src="${imgUrl}" alt="${store.name}" />
            <h3>${store.name}</h3>
            <p>⭐️ Rating: ${store.rating || 'N/A'}</p>
            <p><small>Swipe right to save</small></p>
        `;

        wrapper.appendChild(card);
        container.appendChild(wrapper);

        const hammertime = new Hammer(wrapper);
        hammertime.on('swipeleft', () => {
            wrapper.style.transform = 'translateX(-150%) rotate(-15deg)';
            wrapper.style.opacity = 0;
            setTimeout(() => wrapper.remove(), 100);
        });
        
        hammertime.on('swiperight', () => {
            saveCB(JSON.stringify(comicBookShopData));
            wrapper.style.transform = 'translateX(150%) rotate(15deg)';
            wrapper.style.opacity = 0;
            setTimeout(() => wrapper.remove(), 100);
        });
    });
}

function saveCB(cbJSON) {
    const cbshop = JSON.parse(cbJSON);
    let saved = JSON.parse(localStorage.getItem('savedComicBookShops') || '[]');
    
    if (!saved.find(c => c.place_id === cbshop.place_id)) {
        saved.push(cbshop);
        localStorage.setItem('savedComicBookShops', JSON.stringify(saved));
        alert(`${cbshop.name} saved!`);
    } else {
        alert(`${cbshop.name} is already saved.`);
    }
}

function showSaved() {
    const container = document.querySelector('.cards');
    container.innerHTML = '';
    
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
}