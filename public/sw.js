var STATIC_CONTENT_CACHE_PREFIX = 'currency-converter-cache-v';
var STATIC_CONTENT_CACHE_VERSION = 6
var STATIC_CONTENT_CACHE_NAME = STATIC_CONTENT_CACHE_PREFIX + STATIC_CONTENT_CACHE_VERSION

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
        return cache.addAll(urlsToCache);
      }).catch(error=> console.log("Open Error: "+ error))
  );
});

self.addEventListener('activate', function(event){
   event.waitUntil(
     caches.keys().then(function(keys){
         var deletePromises = []

         keys.forEach(function(cache){
            if(cache.startsWith(STATIC_CONTENT_CACHE_PREFIX) 
                  && STATIC_CONTENT_CACHE_NAME !== cache)               
              deletePromises.push(caches.delete(STATIC_CONTENT_CACHE_NAME))        })

         return Promise.all(deletePromises)           
     })
   )
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