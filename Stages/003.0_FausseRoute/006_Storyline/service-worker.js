var CACHE_NAME = 'forked_cache_v001';
var urlsToCache = [
  'index.html'
, 'js/main.js'
];


self.addEventListener('install', treatInstallation)

function treatInstallation(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
          .then(cacheFiles)
  )

  function cacheFiles(cache) {
    console.log('Opened cache');
    return cache.addAll(urlsToCache);
  }
}


self.addEventListener('fetch', fetchFile)

function fetchFile(event) {
  event.respondWith(
    caches.match(event.request)
          .then(dealWithRequest)
  )

  function dealWithRequest(response) {
    // Cache hit - return response
    if (response) {
      console.log("Cache served a file:", event)
      return response;
    } else {
      console.log("Requesting a file from the server:", event)
      return fetchAndCacheRequestedFile(event)
    }
  }
   
  function fetchAndCacheRequestedFile(event) {
    // Actually, don't do any caching yet, just in case :)
    return fetch(event.request)

    //// THE CODE FROM HERE ON IS NOT BEING USED YET ////

    // IMPORTANT: Clone the request. A request is a stream and
    // can only be consumed once. Since we are consuming this
    // once by cache and once by the browser for fetch, we need
    // to clone the response.
    var fetchRequest = event.request.clone()

    return fetch(fetchRequest).then(cacheTheFileIfItArrived)
  }

  function cacheTheFileIfItArrived(response) {
    // Check if we received a valid response
    if(!response || response.status !== 200 || response.type !== 'basic') {
      console.log(response)
      return response
    }

    // IMPORTANT: Clone the response. A response is a stream
    // and because we want the browser to consume the response
    // as well as the cache consuming the response, we need
    // to clone it so we have two streams.
    var responseToCache = response.clone()

    caches.open(CACHE_NAME)
      .then(function(cache) {
        cache.put(event.request, responseToCache)
      })

    return response
  }
}