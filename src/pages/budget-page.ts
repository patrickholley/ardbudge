import "@components/ard-budget.ts";
import "@components/ard-table.ts";
import "@components/form-modal.ts";
import ardRender from "@utils/ardRender";

const componentTag = "budget-page";

class BudgetPage extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        ardRender(this);
    }
}

customElements.define(componentTag, BudgetPage);
