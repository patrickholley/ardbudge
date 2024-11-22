import ardRender from "@utils/ardRender";
import {getBudgetId} from "@utils/getBudgetId";
import {store} from "@store";
import {Expense} from "@app-types/store";

const componentTag = 'ard-table';

class Table extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        this.budgetId = getBudgetId();
        ardRender(this);
    }

    onRender = () => {
        this.onStoreUpdate();
        document.addEventListener('submit-form', (formData) => this.onFormSubmit((formData as CustomEvent).detail));
    }

    onFormSubmit = (formData: FormData) => {
        const formEntries = Object.fromEntries(formData.entries()) as unknown as Expense;
        formEntries.cost = parseFloat(formEntries.cost).toFixed(2);

        store.addRow(
            this.budgetId || '',
            formEntries
        );
    }

    onStoreUpdate = () => {
        const budgetData = store.getBudget(this.budgetId || '');
        if (budgetData) {
            const tableBody = this.shadowRoot?.getElementById("ard-table__body");

            if (tableBody) {
                tableBody.innerHTML = budgetData.rows.map(datum => (
                    `<tr>
                <td>${datum.date}</td>
                <td>${datum.description}</td>
                <td>${datum.cost}</td>
            </tr>`
                )).join('');
            }
        }
    }
}

customElements.define(componentTag, Table);
