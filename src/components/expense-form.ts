import ExpenseFormTemplate from "@templates/expense-form.html?raw";
import getStyleElement from '@utils/getStyleElement';
import ExpenseFormStyles from "@styles/expense-form.css?inline"
import {store} from "../store";
import {ArdBudgeDatum} from "@app-types/store";

class ExpenseForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const range = document.createRange();
        range.selectNode(document.body);
        const fragment = range.createContextualFragment(ExpenseFormTemplate);
        const template = fragment.querySelector('#expense-form') as HTMLTemplateElement;

        if (template && this.shadowRoot) {
            const content = template.content.cloneNode(true);
            this.shadowRoot.appendChild(content);
            this.shadowRoot.appendChild(getStyleElement(ExpenseFormStyles));
        }
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

        store.addRow(
            'MyFirstBudge',
            Object.fromEntries(
                new FormData(e.target as HTMLFormElement).entries()
            ) as unknown as ArdBudgeDatum
        );

        this.toggleOpen(false);
    }

    connectedCallback() {
        document.addEventListener('open-expense-form', () => this.toggleOpen(true));
        this.shadowRoot?.querySelector('form')?.addEventListener('submit', this.onSubmit);
        this.shadowRoot?.querySelector('#button__cancel')
            ?.addEventListener('click', () => this.toggleOpen(false));
        this.shadowRoot?.querySelectorAll('input')
            ?.forEach(input => input.addEventListener('input', this.checkFormValidity));
    }
}

customElements.define('expense-form', ExpenseForm);
