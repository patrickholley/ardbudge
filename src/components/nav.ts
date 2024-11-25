import getFileStrings from "@utils/getFileStrings";

const componentTag = 'ard-nav';

class Nav extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        getFileStrings(componentTag).then(([templateString, stylesString]) => {
            // TODO: Pull into separate function
            const range = document.createRange();
            range.selectNode(document.body);
            const fragment = range.createContextualFragment(templateString);
            const template = fragment.querySelector(`#${componentTag}`) as HTMLTemplateElement;

            if (template) {
                const content = template.content.cloneNode(true);
                shadowRoot.appendChild(content);
            }

            const style = document.createElement('style');
            style.textContent = stylesString;
            shadowRoot.appendChild(style);
        });

    }

    onRender() {
    }
}

customElements.define(componentTag, Nav);
