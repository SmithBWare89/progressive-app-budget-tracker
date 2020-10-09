const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILE_TO_CACHE = [
    "/",
    "/index.html"
];


self.addEventListener("fetch", async (e) => {
    try {
        const request = await e.respondWith(
            caches.match(e.request)
        );

        if (request) {
            console.log(`Responding with cache: ${e.request.url}`);
            return request;
        } else {
            console.log(`File is not cached, fetching: ${e.request.url}`);
            return fetch(e.request);
        }
    } catch (err) {
        console.log(err);
    }
});

self.addEventListener("install", async (e) => {
    try {
        const cache = await e.waitUntil(caches.open(CACHE_NAME));
        console.log(`Installing cache: ${CACHE_NAME}`);
        return cache.addAll(FILE_TO_CACHE);
    } catch (error) {
        console.log(error);
    }
});

self.addEventListener("activate", async (e) => {
    try {
        const keyList = await e.waitUntil(caches.keys());

        if (keyList) {
            let cacheKeepList = keyList.filter(key => {
                return key.indexOf(APP_PREFIX);
            })
            
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(keyList.map((key, i) => {
                if(cacheKeepList.indexOf(key) === -1) {
                    console.log(`Deleting caches: ${keyList[i]}`);
                    return caches.delete(keyList[i]);
                };
            }));
        };
    } catch (error) {
        console.log(error);
    }
});