import "@components/ard-budge.ts";
import "@components/ard-table.ts";
import "@components/expense-form.ts";
import render from "@utils/render";

class BudgePage extends HTMLElement {
    constructor() {
        super();
        render(this);
    }
}

customElements.define('budge-page', BudgePage);
