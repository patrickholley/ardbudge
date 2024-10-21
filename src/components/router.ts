import '@components/home-page.ts';
import AppConstants from "@utils/appConstants";
import {Path, Routes} from "@app-types/router";

class Router {
    routes: Routes;

    constructor() {
        this.routes = AppConstants.Routes;
        window.addEventListener('popstate', this.handlePopState.bind(this));
        this.handlePopState();
    }

    handlePopState(): void {
        const { pathname } = window.location;
        let route = this.routes[pathname as Path];

        if (!this.routes.hasOwnProperty(pathname)) {
            window.history.replaceState({}, '/', window.location.origin + '/');
            route = this.routes["/"];
        }

        const appEl = document.getElementById("app");
        if (appEl) appEl.innerHTML = `<${route} />`;
    }
}

new Router();
