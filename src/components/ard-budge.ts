import ArdBudgeTemplate from "@templates/ard-budge.html?raw";
import getStyleElement from '@utils/getStyleElement';
import ArdBudgeStyles from "@styles/ard-budge.css?inline"

class ArdBudge extends HTMLElement {
    ardTable: HTMLElement | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const range = document.createRange();
        range.selectNode(document.body);
        const fragment = range.createContextualFragment(ArdBudgeTemplate);
        const template = fragment.querySelector('#ard-budge') as HTMLTemplateElement;

        if (template && this.shadowRoot) {
            const content = template.content.cloneNode(true);
            this.shadowRoot.appendChild(content);
            this.shadowRoot.appendChild(getStyleElement(ArdBudgeStyles));
        }
    }

    onAddExpense = () => {
        const openExpenseFormEvent = new CustomEvent('open-expense-form', {
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(openExpenseFormEvent);
    }

    connectedCallback() {
        this.shadowRoot?.getElementById('add-expense')?.addEventListener('click', this.onAddExpense);
    }
}

customElements.define('ard-budge', ArdBudge);
