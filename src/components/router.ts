import '@pages/budge-page.ts';
import '@pages/landing-page.ts';
import AppConstants from "@utils/appConstants";
import {PageComponent, Path, Routes} from "@app-types/router";

class Router {
    private readonly _routes: Routes;

    constructor() {
        this._routes = AppConstants.Routes;
        window.addEventListener('popstate', this.handlePopState.bind(this));
        this.handlePopState();
    }

    handlePopState(): void {
        const { pathname } = window.location;
        let route: PageComponent | undefined;

        // Function to match dynamic paths
        const matchDynamicRoute = (path: string): [string, string] | undefined => {
            const parts = Object.entries(this._routes).find(([route]) => {
                const routePattern = new RegExp(`^${route.replace(/:[^\s/]+/g, '([\\w-]+)')}$`);
                return routePattern.test(path);
            });

            if (parts) {
                const [routePattern, component] = parts;
                return [routePattern, component];
            }
            return undefined;
        };

        if (this._routes.hasOwnProperty(pathname as Path)) {
            route = this._routes[pathname as Path];
        } else {
            const matchedRoute = matchDynamicRoute(pathname);
            if (matchedRoute) {
                route = matchedRoute[1] as PageComponent;
            }
        }

        if (!route) {
            window.history.replaceState({}, '/', window.location.origin + '/');
            route = this._routes["/"];
        }

        const appEl = document.getElementById("app");
        if (appEl) appEl.innerHTML = `<${route} />`;
    }
}

new Router();
