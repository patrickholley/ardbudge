const getQueryParams = () => {
  const params = new URL(self.location).searchParams;
  const envVariables = {};
  for (const [key, value] of params.entries()) {
    envVariables[key] = value;
  }
  return envVariables;
}

const { MODE, VERSION } = getQueryParams();

const isProduction = MODE === 'production';
const CACHE_NAME = `ard-cache-v${VERSION}`;

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/fav.ico',
];

self.addEventListener('install', (event) => {
    if (!isProduction) {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => cache.addAll(FILES_TO_CACHE))
        );
    } else {
        event.waitUntil(
            fetch('/.vite/manifest.json')
                .then(response => response.headers.get('content-type').includes('text/html') ? response : response.json())
                .then(manifest => {
                    const filesToCache = [
                        ...FILES_TO_CACHE,
                        ...Object.values(manifest).map(entry => [entry.css[0], entry.file]).flat(),
                    ];

                    return caches.open(CACHE_NAME)
                        .then(cache => {
                            return cache.addAll(filesToCache);
                        });
                })
        );
    }
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(err => console.log(err))
    );
});
