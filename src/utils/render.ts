import {store} from "@store";
import pascalToSnake from "./pascalToSnake";
import getFileStrings from "./getFileStrings";

const render = (component: HTMLElement) => {
    const componentId = pascalToSnake(component.constructor.name);

    try {
        getFileStrings(componentId).then((result) => {
            const [templateString, stylesString] =  result;
            const shadowRoot = component.attachShadow({ mode: 'open' });

            const range = document.createRange();
            range.selectNode(document.body);
            const fragment = range.createContextualFragment(templateString);
            const template = fragment.querySelector(`#${componentId}`) as HTMLTemplateElement;

            if (template) {
                const content = template.content.cloneNode(true);
                shadowRoot.appendChild(content);
            }

            const style = document.createElement('style');
            style.textContent = stylesString;
            shadowRoot.appendChild(style);

            if (component.onStoreUpdate) {
                store.subscribe(component.onStoreUpdate);

                component.disconnectedCallback = () => {
                    store.unsubscribe(component.onStoreUpdate);
                }
            }

            if (component.onRender) component.onRender();
        });
    } catch (error) {
        console.error(`Error rendering component ${componentId}:`, error);
    }
}

export default render;