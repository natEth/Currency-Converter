var STATIC_CONTENT_CACHE_PREFIX = 'currency-converter-cache-v';
var STATIC_CONTENT_CACHE_VERSION = 2
var STATIC_CONTENT_CACHE_NAME = STATIC_CONTENT_CACHE_PREFIX + STATIC_CONTENT_CACHE_VERSION

var urlsToCache = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/img/favicon.ico',
  'https://fonts.googleapis.com/css?family=Open+Sans'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CONTENT_CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      }).catch(error=> console.log("Open Error: "+ error))
  );
});

self.addEventListener('activate', function(event){
   event.waitUntil(
     caches.keys().then(function(keys){
         return Promise.all(keys.filter(function(key){
            return key.startsWith(STATIC_CONTENT_CACHE_PREFIX) 
                     && key != STATIC_CONTENT_CACHE_NAME      
          }).map(function(key){
              return caches.delete(key)
          }))
     }));
})

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


  self.addEventListener('message', function(event){
    if(event.data.action == 'skipWaiting')
      self.skipWaiting()
  })