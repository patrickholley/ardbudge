import render from "@utils/render";

class ArdBudge extends HTMLElement {
    _ardTable: HTMLElement | null = null;

    constructor() {
        super();
        render(this);
    }

    onAddExpense = () => {
        const openExpenseFormEvent = new CustomEvent('open-expense-form', {
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(openExpenseFormEvent);
    }

    onRender() {
        const addExpenseButton = this.shadowRoot?.getElementById('add-expense');
        addExpenseButton?.addEventListener('click', this.onAddExpense);
    }
}

customElements.define('ard-budge', ArdBudge);
