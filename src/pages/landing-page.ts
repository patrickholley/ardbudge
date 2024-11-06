import ardRender from "@utils/ardRender";

const componentTag = "landing-page";

class LandingPage extends HTMLElement {
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
        this.shadowRoot?.getElementById('create-budge')?.addEventListener('click', this.openForm);
    }
}

customElements.define(componentTag, LandingPage);
