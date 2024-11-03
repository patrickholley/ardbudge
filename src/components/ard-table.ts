import {store} from "@store";
import render from "@utils/render";

class ArdTable extends HTMLElement {
    constructor() {
        super();
        render(this);
    }

    onRender = () => {
        this.onStoreUpdate();
    }

    onStoreUpdate = () => {
        const budgeData = store.getBudges().MyFirstBudge.rows;
        const tableBody = this.shadowRoot?.getElementById("ard-table__body");

        if (tableBody) {
            tableBody.innerHTML = budgeData.map(datum => (
                `<tr>
                <td>${datum.date}</td>
                <td>${datum.description}</td>
                <td>${datum.cost}</td>
            </tr>`
            )).join('');
        }
    }
}

customElements.define('ard-table', ArdTable);
