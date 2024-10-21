import ArdBudgeTemplate from "@templates/ard-budge.html?raw";
import getStyleElement from '@utils/getStyleElement';
import ArdBudgeStyles from "@styles/ard-budge.css?inline"

class ArdBudge extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        const range = document.createRange();
        range.selectNode(document.body);
        const fragment = range.createContextualFragment(ArdBudgeTemplate);

        // Find the template in the parsed fragment and clone its content
        const template = fragment.querySelector('#ard-budge') as HTMLTemplateElement;
        if (template) {
            const content = template.content.cloneNode(true);
            // Append the cloned content to the shadow root
            shadowRoot.appendChild(content);
            shadowRoot.appendChild(getStyleElement(ArdBudgeStyles));
        }
    }
}

customElements.define('ard-budge', ArdBudge);
