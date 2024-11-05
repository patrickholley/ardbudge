import {store} from "@store";
import {ArdBudgeDatum} from "@app-types/store";
import ardRender from "@utils/ardRender";

const componentTag = 'expense-form';

class ExpenseForm extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        ardRender(this);
    }

    toggleOpen = (shouldBeOpen: boolean) => {
        const formModal = this.shadowRoot?.querySelector('#form-modal') as HTMLElement;
        if (formModal) formModal.style.display = shouldBeOpen ? 'block' : 'none';
    }

    checkFormValidity = () => {
        const isFormValid = Array.from(
            new FormData(this.shadowRoot?.querySelector('form') as HTMLFormElement
        ).values()).every(value => value);

        const submitButton = this.shadowRoot?.querySelector('#button__submit') as HTMLButtonElement;
        if (submitButton) submitButton.disabled = !isFormValid;
    }

    onSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        const formEntries = Object.fromEntries(
            new FormData(e.target as HTMLFormElement).entries()
        ) as unknown as ArdBudgeDatum;

        formEntries.cost = parseFloat(formEntries.cost).toFixed(2);

        store.addRow(
            'MyFirstBudge',
            formEntries
        );

        this.toggleOpen(false);
    }

    onRender() {
        document.addEventListener('open-expense-form', () => this.toggleOpen(true));
        this.shadowRoot?.querySelector('form')?.addEventListener('submit', this.onSubmit);
        this.shadowRoot?.querySelector('#button__cancel')
            ?.addEventListener('click', () => this.toggleOpen(false));
        this.shadowRoot?.querySelectorAll('input')
            ?.forEach(input => input.addEventListener('input', this.checkFormValidity));
    }
}

customElements.define(componentTag, ExpenseForm);
