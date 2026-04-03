// Service Worker for Tech Fluency: offline-first study tool
// Strategy:
//   App shell (index.html, manifest, fonts) — network-first, cache fallback
//   Lesson files (js/lessons/*.js, js/lessons-manifest.js) — cache-first, then network

const CACHE = 'techfluency-v1';

const APP_SHELL = [
    '.',                         // alias for index.html from the SW scope root
    './index.html',
    './js/lessons-manifest.js',
    './manifest.json'
];

// ---- Install: cache the app shell --------------------------------
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE).then(function (cache) {
            // addAll fails if any single request fails; we use individual
            // add() calls so a missing font doesn't abort the install.
            return Promise.allSettled(
                APP_SHELL.map(function (url) { return cache.add(url); })
            );
        }).then(function () {
            return self.skipWaiting();   // activate immediately
        })
    );
});

// ---- Activate: prune old caches ----------------------------------
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys
                    .filter(function (k) { return k !== CACHE; })
                    .map(function (k) { return caches.delete(k); })
            );
        }).then(function () {
            return self.clients.claim();  // take control of open pages
        })
    );
});

// ---- Fetch: route by resource type -------------------------------
self.addEventListener('fetch', function (event) {
    var url = new URL(event.request.url);

    // Only handle same-origin GET requests
    if (event.request.method !== 'GET') return;
    if (url.origin !== self.location.origin) {
        // External resources (Google Fonts, etc.) — network with cache fallback
        event.respondWith(networkWithCacheFallback(event.request));
        return;
    }

    var path = url.pathname;

    // Lesson files and manifest — cache-first (immutable once fetched)
    if (path.includes('/js/lessons/') || path.endsWith('/js/lessons-manifest.js')) {
        event.respondWith(cacheFirst(event.request));
        return;
    }

    // Everything else — network-first (keeps HTML/SW fresh)
    event.respondWith(networkFirst(event.request));
});

// ---- Strategy helpers --------------------------------------------

function cacheFirst(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (cached) {
            if (cached) return cached;
            return fetch(request).then(function (response) {
                if (response.ok) cache.put(request, response.clone());
                return response;
            });
        });
    });
}

function networkFirst(request) {
    return fetch(request).then(function (response) {
        if (response.ok) {
            caches.open(CACHE).then(function (cache) {
                cache.put(request, response.clone());
            });
        }
        return response;
    }).catch(function () {
        return caches.match(request).then(function (cached) {
            return cached || new Response('Offline — content not yet cached.', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
            });
        });
    });
}

function networkWithCacheFallback(request) {
    return fetch(request).then(function (response) {
        if (response.ok) {
            caches.open(CACHE).then(function (cache) {
                cache.put(request, response.clone());
            });
        }
        return response;
    }).catch(function () {
        return caches.match(request);
    });
}
