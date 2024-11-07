//import {store} from "@store";
import ardRender from "@utils/ardRender";
import {getBudgeId} from "@utils/getBudgeId";
import {store} from "@store";
import {ArdBudgeDatum} from "@app-types/store";

const componentTag = 'ard-table';

class ArdTable extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        this.budgeId = getBudgeId();
        ardRender(this);
    }

    onRender = () => {
        this.onStoreUpdate();
        document.addEventListener('submit-form', (formData) => this.onFormSubmit((formData as CustomEvent).detail));
    }

    onFormSubmit = (formData: FormData) => {
        const formEntries = Object.fromEntries(formData.entries()) as unknown as ArdBudgeDatum;
        formEntries.cost = parseFloat(formEntries.cost).toFixed(2);

        store.addRow(
            this.budgeId || '',
            formEntries
        );
    }

    onStoreUpdate = () => {
        const budgeData = store.getBudge(this.budgeId || '');
        if (budgeData) {
            const tableBody = this.shadowRoot?.getElementById("ard-table__body");

            if (tableBody) {
                tableBody.innerHTML = budgeData.rows.map(datum => (
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

customElements.define(componentTag, ArdTable);
