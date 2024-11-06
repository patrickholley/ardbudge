//import {store} from "@store";
import ardRender from "@utils/ardRender";

const componentTag = 'ard-table';

class ArdTable extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        ardRender(this);
    }

    onRender = () => {
        this.onStoreUpdate();
    }

    onStoreUpdate = () => {
        /*const budgeData = store.getBudges().MyFirstBudge.rows;
        const tableBody = this.shadowRoot?.getElementById("ard-table__body");

        if (tableBody) {
            tableBody.innerHTML = budgeData.map(datum => (
                `<tr>
                <td>${datum.date}</td>
                <td>${datum.description}</td>
                <td>${datum.cost}</td>
            </tr>`
            )).join('');
        }*/
    }
}

customElements.define(componentTag, ArdTable);
