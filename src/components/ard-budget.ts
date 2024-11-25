import ardRender from "@utils/ardRender";
import {store} from "@store";
import {getBudgetId} from "@utils/getBudgetId";

const componentTag = 'ard-budget';

class ArdBudget extends HTMLElement {
    _table: HTMLElement | null = null;

    constructor() {
        super();
        this.componentTag = componentTag;
        this.budgetName = store.getBudget(getBudgetId())?.name;
        ardRender(this);
    }

    openForm = () => {
        const openFormEvent = new CustomEvent('open-form', {
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(openFormEvent);
    }

    onRender() {
        this.shadowRoot?.getElementById('add-expense')?.addEventListener('click', this.openForm);
        const budgetNameHeader = this.shadowRoot?.getElementById('budget-name');
        if (budgetNameHeader) budgetNameHeader.innerHTML = this.budgetName || '';
    }
}

customElements.define(componentTag, ArdBudget);
