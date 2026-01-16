const CACHE_NAME = 'louvre-v12'; // On augmente le numéro pour forcer la mise à jour
const urlsToCache = [
  './',
  './index.html',
  './introduction.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './background.png',
  './splash.png',
  './fin_de_jeu.html',
  './enigme1.html',
  './enigme2.html',
  './enigme3.html',
  './enigme4.html',
  './enigme5.html',
  './enigme6.html',
  './enigme7.html',
  './enigme8.html',
  './enigme9.html',
  './enigme10.html',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Installation : on met tout en mémoire
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Utilisation : on sert les fichiers depuis la mémoire si on est hors-ligne
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
