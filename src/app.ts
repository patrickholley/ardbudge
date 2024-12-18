import "@components/router";
import '@pages/budget-page.ts';
import '@pages/landing-page.ts';
import '@pages/login-page.ts';

const { MODE, VITE_APP_VERSION } = import.meta.env;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(`/service-worker.js?MODE=${MODE}&VERSION=${VITE_APP_VERSION}`, { type: 'module' })
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
