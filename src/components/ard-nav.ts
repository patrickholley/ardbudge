import {lightRender} from "@utils/ardRender";
import {store} from "@store";

const componentTag = 'ard-nav';

class ArdNav extends HTMLElement {
    slidingNav?: HTMLElement | null;

    constructor() {
        super();
        this.componentTag = componentTag;
        lightRender(this);
    }

    handleDocumentClick = (event: Event) => {
        if (this.slidingNav?.classList.contains('open') && !this.contains(event.target as Node)) {
            this.slidingNav.classList.remove('open');
        }
    }

    handleSignOut = () => {
        store.signOut();
    }

    toggleNav = () => {
        const slidingNav = this.shadowRoot?.getElementById('sliding-nav');
        slidingNav?.classList.toggle('open');
    }

    onRender() {
        document.addEventListener('click', this.handleDocumentClick);
        this.slidingNav = this.shadowRoot?.getElementById('sliding-nav');

        (this.shadowRoot?.getElementById('sign-out') as HTMLButtonElement)
            ?.addEventListener('click', this.handleSignOut);

        (this.shadowRoot?.getElementById('ardfudge-icon-container') as HTMLButtonElement)
            ?.addEventListener('click', this.toggleNav);
    }

    onUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }
}

customElements.define(componentTag, ArdNav);