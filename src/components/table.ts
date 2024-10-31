import TableTemplate from "@templates/table.html?raw";
import TableStyles from "@styles/table-head.css?inline"
import getStyleElement from "@utils/getStyleElement";
import {store} from "../store";

class Table extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        const range = document.createRange();
        range.selectNode(document.body);
        const fragment = range.createContextualFragment(TableTemplate);
        const template = fragment.querySelector('#ard-table') as HTMLTemplateElement;

        if (template) {
            const content = template.content.cloneNode(true);
            shadowRoot.appendChild(content);
            shadowRoot.appendChild(getStyleElement(TableStyles));
        }
    }

    connectedCallback() {
        this.renderRows();
        store.subscribe(this.renderRows.bind(this));
    }

    disconnectedCallback() {
        store.unsubscribe(this.renderRows.bind(this));
    }

    renderRows() {
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

customElements.define('ard-table', Table);
