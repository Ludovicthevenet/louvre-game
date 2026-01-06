const CACHE_NAME = 'louvre-game-cache-v1'; // Changez 'v1' à 'v2', 'v3' etc. à chaque mise à jour majeure !
    const urlsToCache = [
      '/', // La page d'accueil
      '/index.html',
      'introduction.html'
      '/styles.css',
      '/script.js',
      '/manifest.json',
      'background.png',
      'splash.png'
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png',
      '/enigme1.html',
      '/enigme2.html',
      '/enigme3.html',
      '/enigme4.html',
      '/enigme5.html',
      '/enigme6.html',
      '/enigme7.html',
      '/enigme8.html',
      '/enigme9.html',
      '/enigme10.html',
      '/fin_de_jeu.html'
      // Si vous avez des images spécifiques pour les énigmes, ajoutez-les ici aussi, ex:
      // '/images/gudea_statue.jpg',
      // '/images/sphinx_louvre.png',
      // etc.
    ];

    // --- NE CHANGEZ RIEN CI-DESSOUS SAUF SI VOUS SAVEZ CE QUE VOUS FAITES ---

    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => {
            console.log('Service Worker: Cache ouvert');
            return cache.addAll(urlsToCache);
          })
          .catch(error => {
            console.error('Service Worker: Échec de la mise en cache lors de l\'installation:', error);
          })
      );
    });

    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            return fetch(event.request).then(
              function(response) {
                if(!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }
                var responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request, responseToCache);
                  });
                return response;
              }
            ).catch(error => {
                console.error('Service Worker: Échec de la récupération réseau ou du cache:', error);
                // Optionnel: retourner une page offline si la ressource n'est pas dans le cache et pas de réseau
                // return caches.match('/offline.html');
            });
          })
      );
    });

    self.addEventListener('activate', event => {
      const cacheWhitelist = [CACHE_NAME];
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                console.log('Service Worker: Suppression de l\'ancien cache:', cacheName);
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });