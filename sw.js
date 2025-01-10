const cacheName = 'my-portfolio-cache-v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    // Add other assets (images, fonts, etc.) here
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('Caching assets...');
                return cache.addAll(assetsToCache);
            })
            .catch((error) => {
                console.error('Error caching assets:', error);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== cacheName) {
                            console.log('Deleting old cache:', cache);
                            return caches.delete(cache);
                        }
                    })
                );
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Serving from cache:', event.request.url);
                    return response;
                }

                console.log('Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        caches.open(cacheName)
                            .then((cache) => cache.put(event.request, networkResponse.clone()));
                        return networkResponse;
                    });
            })
    );
});