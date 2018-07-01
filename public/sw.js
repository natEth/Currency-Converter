var STATIC_CONTENT_CACHE_NAME = 'currency-converter-cache-v1';

var urlsToCache = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/img/favicon.ico'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CONTENT_CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      }).catch(error=> console.log("Open Error: "+ error))
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          
          if (response) 
            return response;
          

          var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              var responseToCache = response.clone();
  
              caches.open(STATIC_CONTENT_CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          ).catch(error=> console.log("Fetch Error: "+ error));
        })
      );
  });