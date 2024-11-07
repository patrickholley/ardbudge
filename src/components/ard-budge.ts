import ardRender from "@utils/ardRender";
import {store} from "@store";
import {getBudgeId} from "@utils/getBudgeId";

const componentTag = 'ard-budge';

class ArdBudge extends HTMLElement {
    _ardTable: HTMLElement | null = null;

    constructor() {
        super();
        this.componentTag = componentTag;
        this.budgeName = store.getBudge(getBudgeId())?.name;
        ardRender(this);
    }

    openForm = () => {
        const openFormEvent = new CustomEvent('open-form', {
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(openFormEvent);
    }

    onRender() {
        this.shadowRoot?.getElementById('add-expense')?.addEventListener('click', this.openForm);
        const budgeNameHeader = this.shadowRoot?.getElementById('budge-name');
        if (budgeNameHeader) budgeNameHeader.innerHTML = this.budgeName || '';
    }
}

customElements.define(componentTag, ArdBudge);
