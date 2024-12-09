import ardRender from "@utils/ardRender";
import pascalToSnake from "@utils/pascalToSnake";
import getFileStrings from "@utils/getFileStrings";
import FieldsetModule from "./fieldset-module";

const componentTag = 'form-modal';

class FormModal extends HTMLElement {
    module: FieldsetModule | null = null;
    formModal: HTMLElement | null = null;

    constructor() {
        super();
        this.componentTag = componentTag;
        this.formName = this.getAttribute('formName') || '';
        this.legend = this.getAttribute('legend') || '';
        ardRender(this);
    }

    handleOutsideClick(event: MouseEvent) {
        if (!this.shadowRoot?.querySelector('#modal-content')!.contains(event.target as Node)) {
            this.toggleOpen(false);
        }
    }

    async onRender() {
        await this.renderFieldset();
        this.formModal = this.shadowRoot?.querySelector('#modal-container') as HTMLElement;

        document.addEventListener('open-form', () => this.toggleOpen(true));
        this.formModal.addEventListener('click', e => this.handleOutsideClick(e));
        this.shadowRoot?.querySelector('form')?.addEventListener('submit', this.onSubmit);
        this.shadowRoot?.querySelector('#button__cancel')
            ?.addEventListener('click', () => this.toggleOpen(false));
        this.shadowRoot?.querySelectorAll('input, select')
            ?.forEach(input => input.addEventListener('input', this.module!.onChange));
    }

    onSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        this.dispatchEvent(new CustomEvent('submit-form', {
            bubbles: true,
            composed: true,
            detail: new FormData(e.target as HTMLFormElement)
        }));
        this.toggleOpen(false);
    }

    onUnmount() {
        document.removeEventListener('open-form', () => this.toggleOpen(true));
    }

    async renderFieldset() {
        const fileName = pascalToSnake(this.formName || '');

        if (fileName) {
            await getFileStrings(fileName).then(async (result) => {
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

    toggleOpen = (shouldBeOpen: boolean) => {
        this.formModal!.style.display = shouldBeOpen ? 'block' : 'none';
    }
}

customElements.define(componentTag, FormModal);
