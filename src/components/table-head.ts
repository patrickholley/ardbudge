import TableTemplate from "@templates/table-head.html?raw";
import TableStyles from "@styles/table-head.css?inline"
import getStyleElement from "@utils/getStyleElement";

class TableHead extends HTMLTableSectionElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback(): Promise<void> {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = TableTemplate;
            this.shadowRoot.appendChild(getStyleElement(TableStyles));
        }
    }

    disconnectedCallback(): void {
    }
}

customElements.define('ard-table-head', TableHead, { extends: 'thead' });
