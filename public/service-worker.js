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

const DEV_FILES_TO_CACHE = [
    '/',
    '/dango.ico',
    '/index.html',
    '/src/app.ts'
];

self.addEventListener('install', (event) => {
    if (!isProduction) {
        // Cache development files
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => cache.addAll(DEV_FILES_TO_CACHE))
        );
    } else {
        // Cache production files using the manifest
        event.waitUntil(
            fetch('/.vite/manifest.json')
                .then(response => response.headers.get('content-type').includes('text/html') ? response : response.json())
                .then(manifest => {
                    const filesToCache = [
                        '/',
                        '/index.html',
                        '/manifest.json',
                        '/fav.ico',
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
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
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
