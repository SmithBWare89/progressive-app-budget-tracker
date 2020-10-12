self.addEventListener('fetch', async (e) => {
    const url = '/api/transaction';
    try {
        if (e.request.url.includes(url)) {
            let cachedData = await getData();
            if(cachedData){
                console.log('Retrieved cached data');
                return cachedData;
            }
            console.log('Retrieving fresh ')
        }
    } catch (error) {
        
    }
})

async function getData() {
    let cachedData = await getCachedData(DATA_CACHE_NAME, url);
    if(cachedData){
        console.log('Retrieved cached data');
        return cachedData;
    }
    console.log('Retrieving fresh data')
    const cacheStorage = await caches.open(DATA_CACHE_NAME);
    await cacheStorage.add(url);
    cachedData = await getCachedData(DATA_CACHE_NAME, url);
    console.log(cachedData);
    await deleteOldCaches(DATA_CACHE_NAME);
    return cachedData;
}

async function getCachedData(cacheName, url) {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);
    if(!cachedResponse || !cachedResponse.ok) {return false}
    return await cachedResponse.json();
}