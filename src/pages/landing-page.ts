import ardRender from "@utils/ardRender";
import {store} from "@store";

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

    onFormSubmit = (formData: FormData) => {
        const name = formData.get('name');

        if (typeof name === 'string') store.addBudge(name);
        this.renderBudgeList();
    }

    renderBudgeList() {
        const budgeList = this.shadowRoot?.getElementById('budge-list');
        if (budgeList) {
            budgeList.innerHTML = '';
            const budges = store.getBudges();

            budges.forEach((budge) => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');

                link.href = `/budge/${budge.id}`;
                link.textContent = budge.name;

                listItem.appendChild(link);
                budgeList.appendChild(listItem);
            });
        }
    }

    onRender() {
        this.shadowRoot?.getElementById('create-budge')?.addEventListener('click', this.openForm);
        document.addEventListener('submit-form', e => this.onFormSubmit((e as CustomEvent).detail));
        this.renderBudgeList();
    }
}

customElements.define(componentTag, LandingPage);
