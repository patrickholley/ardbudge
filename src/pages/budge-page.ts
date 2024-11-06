import "@components/ard-budge.ts";
import "@components/ard-table.ts";
import "@components/form-modal.ts";
import ardRender from "@utils/ardRender";

const componentTag = "budge-page";

class BudgePage extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        ardRender(this);
    }
}

customElements.define(componentTag, BudgePage);
