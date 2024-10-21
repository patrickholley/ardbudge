import TableTemplate from "@templates/table-head.html?raw";
import TableStyles from "@styles/table-head.css?inline"
import getStyleElement from "@utils/getStyleElement";

class TableHead extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        const range = document.createRange();
        range.selectNode(document.body);
        const fragment = range.createContextualFragment(TableTemplate);
        console.log("?");
        // Find the template in the parsed fragment and clone its content
        const template = fragment.querySelector('#ard-table-head') as HTMLTemplateElement;
        if (template) {
            const content = template.content.cloneNode(true);
            // Append the cloned content to the shadow root
            shadowRoot.appendChild(content);
            shadowRoot.appendChild(getStyleElement(TableStyles));
            console.log("!");
        }
    }
}

customElements.define('ard-table-head', TableHead);
