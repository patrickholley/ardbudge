import ardRender from "@utils/ardRender";
import {store} from "@store";
import {Budget} from "@app-types/services";

const componentTag = "landing-page";

class LandingPage extends HTMLElement {
    budgetList?: HTMLElement | null;

    constructor() {
        super();
        this.componentTag = componentTag;
        ardRender(this);
    }

    openForm = () => {
        const openFormEvent = new CustomEvent('open-form', {
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(openFormEvent);
    }

    onFormSubmit = async (formData: FormData) => {
        const name = formData.get('name');

        console.log(formData);

        if (typeof name === 'string') await store.createBudget({ name, settings: {} });
        await this.renderBudgetList();
    }

    renderBudgetItem = (budget: Budget) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.href = `/budget/${budget.id}`;
        link.textContent = budget.name;

        listItem.appendChild(link);
        this.budgetList!.appendChild(listItem);
    }

    async renderBudgetList() {
        this.budgetList = this.shadowRoot?.getElementById('budget-list');
        this.budgetList!.innerHTML = '';
        await store.getBudgets();
        const budgets = store.getState().budgets;
        budgets.forEach(this.renderBudgetItem);
    }

    onRender() {
        this.shadowRoot?.getElementById('create-budget')?.addEventListener('click', this.openForm);
        document.addEventListener('submit-form', e => this.onFormSubmit((e as CustomEvent).detail));
        this.renderBudgetList().then();
    }
}

customElements.define(componentTag, LandingPage);
