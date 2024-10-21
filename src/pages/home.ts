import HomeStyles from "@styles/home.css?inline"
import HomeTemplate from "@templates/home.html?raw";
import getStyleElement from '@utils/getStyleElement';
import "@components/budget-sheet";
import "@components/table-head";

class HomePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback(): Promise<void> {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = HomeTemplate;
            this.shadowRoot.appendChild(getStyleElement(HomeStyles));
        }
    }

    disconnectedCallback(): void {
    }
}

customElements.define('home-page', HomePage);

export default HomePage;
