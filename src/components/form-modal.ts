import ardRender from "@utils/ardRender";
import pascalToSnake from "@utils/pascalToSnake";
import getFileStrings from "@utils/getFileStrings";
import FieldsetModule from "./fieldset-module";

const componentTag = 'form-modal';

class FormModal extends HTMLElement {
    module: FieldsetModule | null = null;

    constructor() {
        super();
        this.componentTag = componentTag;
        this.formName = this.getAttribute('formName') || '';
        this.legend = this.getAttribute('legend') || '';
        ardRender(this);
    }

    toggleOpen = (shouldBeOpen: boolean) => {
        const formModal = this.shadowRoot?.querySelector('#modal-container') as HTMLElement;
        if (formModal) formModal.style.display = shouldBeOpen ? 'block' : 'none';
    }

    async renderFieldset() {
        const fileName = pascalToSnake(this.formName || '');

        if (fileName) {
            getFileStrings(fileName).then(async (result) => {
                const [templateString, stylesString] = result;

                const fieldset = this.shadowRoot?.querySelector('#form-fieldset') as HTMLElement;
                fieldset.innerHTML = templateString;

                const style = document.createElement('style');
                style.textContent = stylesString;
                this.shadowRoot?.appendChild(style);

                const Module = await import(`./fieldset-${fileName}.ts`);
                this.module = new Module.default(this.shadowRoot);
                this.module?.prepareForm();
            });
        }
    }

    checkFormValidity = () => {
        const isFormValid = Array.from(
            new FormData(this.shadowRoot?.querySelector('form') as HTMLFormElement
        ).values()).every(value => value);

        const submitButton = this.shadowRoot?.querySelector('#button__submit') as HTMLButtonElement;
        if (submitButton) submitButton.disabled = !isFormValid;
    }

    onSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        const submitFormEvent = new CustomEvent('submit-form', {
            bubbles: true,
            composed: true,
            detail: new FormData(e.target as HTMLFormElement)
        });

        this.dispatchEvent(submitFormEvent);
        this.toggleOpen(false);
    }

    async onRender() {
        await this.renderFieldset();
        document.addEventListener('open-form', () => this.toggleOpen(true));

        this.shadowRoot?.querySelector('form')?.addEventListener('submit', this.onSubmit);
        this.shadowRoot?.querySelector('#button__cancel')
            ?.addEventListener('click', () => this.toggleOpen(false));
        this.shadowRoot?.querySelectorAll('input')
            ?.forEach(input => input.addEventListener('input', this.checkFormValidity));
    }
}

customElements.define(componentTag, FormModal);
