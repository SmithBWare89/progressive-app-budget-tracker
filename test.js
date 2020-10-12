const { response } = require("express");

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

self.addEventListener('install', function(e) {
    try {
        const fileCache = await e.waitUntil(caches.open(CACHE_NAME));
        await fileCache.addAll(FILES_TO_CACHE);

        const dataCache = await e.waitUntil(caches.open(DATA_CACHE_NAME));
        const dataFetchResponse = await fetch('/api/transaction');
        await dataCache.put('/api/transaction', dataFetchResponse);
    } catch (error) {
        console.log(error);
    }
})

self.addEventListener('activate', async (e) => {
    try {
        const keyList = await caches.keys();
        const cacheKeepList = keyList.filter((key) => {
            return key === CACHE_NAME || DATA_CACHE_NAME;
        });

        return await Promise.all(
            keyList.map((key, i) => {
                if (cacheKeepList.indexOf(key) === -1) {
                    console.log(`Deleting caches ${keyList[i]}`);
                    return caches.delete(keyList[i]);
                }
            })
        )
    } catch (error) {
        console.log(error)
    }
})