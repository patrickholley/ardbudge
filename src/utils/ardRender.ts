import { StoreListener } from "@app-types/store";
import { store } from "@store";
import pascalToSnake from "./pascalToSnake";
import getFileStrings from "./getFileStrings";
import router from "@components/router";
import {Paths} from "@app-types/router";

// separated for components rendering before router
export const lightRender = (component: HTMLElement, routerObj: typeof router | null = null) => {
    const componentId = pascalToSnake(component.componentTag || '');
    store.incrementLoadingCount();

    try {
        getFileStrings(componentId).then((result) => {
            const [templateString, stylesString] = result;
            const shadowRoot = component.attachShadow({ mode: 'open' });

            const range = document.createRange();
            range.selectNode(document.body);
            const fragment = range.createContextualFragment(templateString);
            const template = fragment.querySelector(`#${componentId}`) as HTMLTemplateElement;

            if (template) {
                const content = template.content.cloneNode(true);
                shadowRoot.appendChild(content);
                routerObj && routerObj.rewireAnchors(shadowRoot);
            }

            const style = document.createElement('style');
            style.textContent = stylesString;
            shadowRoot.appendChild(style);

            if (component.onStoreUpdate) {
                store.subscribe(component.onStoreUpdate);

                component.disconnectedCallback = () => {
                    store.unsubscribe(component.onStoreUpdate as StoreListener);
                }
            }

            if (component.onRender) component.onRender();
            if (component.onUnmount) component.disconnectedCallback = component.onUnmout;
        });
    } catch (error) {
        console.error(`Error rendering component ${componentId}:`, error);
    } finally {
        store.decrementLoadingCount();
    }
}

const ardRender = (component: HTMLElement) => {
    const { currentUser } = store.getState();

    if (!currentUser && router.getCurrentRoute() !== Paths.Login) {
        router.navigate(Paths.Login);
        store.decrementLoadingCount();
        return;
    } else if (currentUser && router.getCurrentRoute() === Paths.Login) {
        router.navigate('/');
    }

    lightRender(component, router);
}

export default ardRender;
