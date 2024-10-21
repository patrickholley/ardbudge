import HomeTemplate from "@templates/home.html?raw";
import getStyleElement from '@utils/getStyleElement';
import HomeStyles from "@styles/home.css?inline"
import "@components/budget-sheet";
import "@components/table-head";

class HomePage extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        const range = document.createRange();
        range.selectNode(document.body);
        const fragment = range.createContextualFragment(HomeTemplate);

        // Find the template in the parsed fragment and clone its content
        const template = fragment.querySelector('#home-page') as HTMLTemplateElement;
        if (template) {
            const content = template.content.cloneNode(true);
            // Append the cloned content to the shadow root
            shadowRoot.appendChild(content);
            shadowRoot.appendChild(getStyleElement(HomeStyles))
        }
    }
}

customElements.define('home-page', HomePage);

export default HomePage;
