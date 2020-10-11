const CACHE_NAME = 'BudgetTracker-V1'
const DATA_CACHE_NAME = 'DataCache-V1'
const FILES_TO_CACHE = [
    "/",
    "./index.html",
    "./assets/css/styles.css",
    "./assets/js/index.js",
    "./assets/js/idb.js",
    "./assets/icons/icon-72x72.png",
    "./assets/icons/icon-96x96.png",
    "./assets/icons/icon-128x128.png",
    "./assets/icons/icon-144x144.png",
    "./assets/icons/icon-152x152.png",
    "./assets/icons/icon-192x192.png",
    "./assets/icons/icon-384x384.png",
    "./assets/icons/icon-512x512.png"
];

// Cache resources
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {
                cache.addAll(FILES_TO_CACHE)
            })
            .then(() => {
                e.waitUntil(
                    caches.open(DATA_CACHE_NAME)
                        .then((cache) => {
                            console.log(`Installing caches ${CACHE_NAME} & ${DATA_CACHE_NAME}`);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                )
            })
    )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
    e.waitUntil(
        // Grab all of the cache keys
        caches.keys()
            .then(function (keyList) {
                // Create a new array of only the caches related to the project
                let cacheKeeplist = keyList.filter(function (key) {
                return key === CACHE_NAME || DATA_CACHE_NAME;
            })
            // Return a promise that loops over the caches grabbed
            return Promise.all(keyList.map(function (key, i) {
                // If a cache doesn't match those related to the project
                if (cacheKeeplist.indexOf(key) === -1) {
                    // Delete the cache
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});

// Respond with cached resources
self.addEventListener('fetch', function (e) {
    // If the fetch request includes /api/transaction
    if (e.request.url.includes('/api/')) {
        e.respondWith(
            // Open the data cache
            caches
                .open(DATA_CACHE_NAME)
                .then(cache => {
                    // Fetch new data
                    return fetch(e.request)
                        .then(response => {
                            // If the fetch is okay then clone the data to the cache
                            if (response.status === 200) {
                                // Set Key to URL
                                // Set Value to response object
                                cache.put(e.request.url, response.clone());
                            }
                            return response;
                        })
                        .catch(err => {
                            return cache.match(e.request);
                        })
                })
                .catch(err => console.log(err))
        )
    } 
    else {
        // If fetch unsuccessful
        e.respondWith(
            fetch(e.request)
                .catch(function() {
                    return caches.match(e.request)
                        .then(response => {
                            if (response) {
                                return response;
                            } else if (e.request.headers.get('accept').includes('text/html')) {
                                // return the cached home page for all requests for html pages
                                return caches.match('/');
                            }
                        })
                })
        )
    }
});