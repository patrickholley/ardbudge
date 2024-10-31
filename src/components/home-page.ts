import HomeTemplate from "@templates/home-page.html?raw";
import getStyleElement from '@utils/getStyleElement.ts';
import HomeStyles from "@styles/home-page.css?inline"
import "@components/ard-budge.ts";
import "@components/table.ts";
import "@components/expense-form.ts";

class HomePage extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        const range = document.createRange();
        range.selectNode(document.body);
        const fragment = range.createContextualFragment(HomeTemplate);
        const template = fragment.querySelector('#home-page') as HTMLTemplateElement;

        if (template) {
            const content = template.content.cloneNode(true);
            shadowRoot.appendChild(content);
            shadowRoot.appendChild(getStyleElement(HomeStyles))
        }
    }
}

customElements.define('home-page', HomePage);

export default HomePage;
