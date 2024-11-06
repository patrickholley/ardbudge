import ardRender from "@utils/ardRender";

const componentTag = 'ard-budge';

class ArdBudge extends HTMLElement {
    _ardTable: HTMLElement | null = null;

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

    onRender() {
        this.shadowRoot?.getElementById('add-expense')?.addEventListener('click', this.openForm);
    }
}

customElements.define(componentTag, ArdBudge);
